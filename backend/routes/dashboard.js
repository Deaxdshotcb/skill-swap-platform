const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/dashboard/recommendations
// @desc    Get recommended users who offer skills the current user wants
router.get('/recommendations', auth, async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT u.id, u.username, u.bio, s.name as skill_name
            FROM users u
            JOIN skill_offers so ON u.id = so.user_id
            JOIN skills s ON so.skill_id = s.id
            WHERE so.skill_id IN (
                SELECT skill_id FROM skill_requests WHERE user_id = ?
            ) AND u.id != ?
            LIMIT 10
        `, [req.user.id, req.user.id]);
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/dashboard/opportunities
// @desc    Get requests from others that the current user can fulfill
router.get('/opportunities', auth, async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT u.id as requester_id, u.username as requester_name, s.name as skill_name
            FROM skill_requests sr
            JOIN users u ON sr.user_id = u.id
            JOIN skills s ON sr.skill_id = s.id
            WHERE sr.skill_id IN (
                SELECT skill_id FROM skill_offers WHERE user_id = ?
            ) AND sr.user_id != ?
            LIMIT 10
        `, [req.user.id, req.user.id]);
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;