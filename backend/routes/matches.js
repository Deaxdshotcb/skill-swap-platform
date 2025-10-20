const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Finds and creates all new matches in a single, efficient query.
router.post('/find', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const [newPotentialMatches] = await db.query(`
            SELECT
                so1.user_id AS user1_id, so2.user_id AS user2_id,
                MIN(so1.id) AS user1_offer_id, MIN(so2.id) AS user2_offer_id
            FROM skill_offers so1
            JOIN skill_requests sr1 ON so1.skill_id = sr1.skill_id AND so1.user_id != sr1.user_id
            JOIN skill_offers so2 ON so2.user_id = sr1.user_id
            JOIN skill_requests sr2 ON so2.skill_id = sr2.skill_id AND sr2.user_id = so1.user_id
            LEFT JOIN matches m ON 
                (m.user1_id = so1.user_id AND m.user2_id = so2.user_id) OR
                (m.user1_id = so2.user_id AND m.user2_id = so1.user_id)
            WHERE so1.user_id = ? AND m.id IS NULL
            GROUP BY so1.user_id, so2.user_id`, [userId]
        );
        
        if (newPotentialMatches.length === 0) {
            return res.json({ msg: "No new matches found." });
        }

        const matchesToInsert = newPotentialMatches.map(match => {
            const user1_id = Math.min(match.user1_id, match.user2_id);
            const user2_id = Math.max(match.user1_id, match.user2_id);
            const user1_offer_id = user1_id === match.user1_id ? match.user1_offer_id : match.user2_offer_id;
            const user2_offer_id = user2_id === match.user1_id ? match.user1_offer_id : match.user2_offer_id;
            return [user1_id, user2_id, user1_offer_id, user2_offer_id];
        });

        await db.query(
            'INSERT INTO matches (user1_id, user2_id, user1_offer_id, user2_offer_id) VALUES ?', 
            [matchesToInsert]
        );

        res.json({ msg: `${matchesToInsert.length} new matches found!` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET all matches for the current user.
router.get('/', auth, async (req, res) => {
    try {
        const [matches] = await db.query(`
            SELECT 
                m.id AS match_id, 
                u1.id AS user1_id, u1.username AS user1_username, s1.name AS user1_skill,
                u2.id AS user2_id, u2.username AS user2_username, s2.name AS user2_skill
            FROM matches m
            JOIN users u1 ON m.user1_id = u1.id 
            JOIN users u2 ON m.user2_id = u2.id
            JOIN skill_offers so1 ON m.user1_offer_id = so1.id JOIN skills s1 ON so1.skill_id = s1.id
            JOIN skill_offers so2 ON m.user2_offer_id = so2.id JOIN skills s2 ON so2.skill_id = s2.id
            WHERE m.user1_id = ? OR m.user2_id = ?`, [req.user.id, req.user.id]);
        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET all messages for a specific match.
router.get('/:id/messages', auth, async (req, res) => {
    try {
        const [messages] = await db.query(
            `SELECT m.id, m.content, m.sender_id, m.created_at, u.username as sender_username 
            FROM messages m JOIN users u ON m.sender_id = u.id
            WHERE match_id = ? ORDER BY m.created_at ASC`, [req.params.id]);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// NEW ROUTE: Checks if a match exists with a specific user.
router.get('/status/:otherUserId', auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.otherUserId;

        const user1 = Math.min(currentUserId, otherUserId);
        const user2 = Math.max(currentUserId, otherUserId);
        
        const [match] = await db.query(
            'SELECT id FROM matches WHERE user1_id = ? AND user2_id = ?',
            [user1, user2]
        );

        if (match.length > 0) {
            res.json({ isMatch: true, match_id: match[0].id });
        } else {
            res.json({ isMatch: false, match_id: null });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;