const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Helper function to get IDs of users the current user has already matched with
const getMatchedUserIds = async (currentUserId) => {
    // This query finds all user IDs from the 'matches' table where the current user is involved
    const query = `
        SELECT user1_id AS matched_id FROM matches WHERE user2_id = ?
        UNION
        SELECT user2_id AS matched_id FROM matches WHERE user1_id = ?
    `;
    const [matches] = await db.query(query, [currentUserId, currentUserId]);
    // It returns a simple array of just the IDs, for example: [5, 12, 23]
    return matches.map(match => match.matched_id);
};

// GET /api/dashboard/recommendations
router.get('/recommendations', auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        // 1. Get a list of users you've already matched with
        const matchedUserIds = await getMatchedUserIds(currentUserId);

        // 2. Create a final list of all users to exclude from the results
        const usersToExclude = [...matchedUserIds, currentUserId];

        const query = `
            SELECT 
                u.id, 
                u.username, 
                u.bio, 
                GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') as skills_offered
            FROM users u
            JOIN skill_offers so ON u.id = so.user_id
            JOIN skills s ON so.skill_id = s.id
            WHERE so.skill_id IN (
                SELECT skill_id FROM skill_requests WHERE user_id = ?
            ) 
            AND u.id NOT IN (?) -- 3. Filter out all excluded users
            GROUP BY u.id
            LIMIT 10
        `;
        
        // If the exclusion list is empty (no matches yet), we pass [0] as a safe default value
        const [users] = await db.query(query, [currentUserId, usersToExclude.length > 0 ? usersToExclude : [0]]);
        res.json(users);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/dashboard/opportunities
router.get('/opportunities', auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        // 1. Get the same list of matched users
        const matchedUserIds = await getMatchedUserIds(currentUserId);

        // 2. Create the exclusion list
        const usersToExclude = [...matchedUserIds, currentUserId];

        const query = `
            SELECT 
                u.id as requester_id, 
                u.username as requester_name, 
                GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') as skills_requested
            FROM skill_requests sr
            JOIN users u ON sr.user_id = u.id
            JOIN skills s ON sr.skill_id = s.id
            WHERE sr.skill_id IN (
                SELECT skill_id FROM skill_offers WHERE user_id = ?
            ) 
            AND sr.user_id NOT IN (?) -- 3. Filter out all excluded users
            GROUP BY u.id
            LIMIT 10
        `;

        const [requests] = await db.query(query, [currentUserId, usersToExclude.length > 0 ? usersToExclude : [0]]);
        res.json(requests);

    } catch (err)
     {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;