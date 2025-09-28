// routes/requests.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../auth');

// @route   POST api/requests
// @desc    Create a new skill request [cite: 37]
router.post('/', auth, async (req, res) => {
    const { skill_id } = req.body;
    const user_id = req.user.id;
    try {
        const [result] = await pool.query(
            'INSERT INTO Skill_Request (user_id, skill_id) VALUES (?, ?)',
            [user_id, skill_id]
        );
        res.json({ msg: 'Request created successfully', requestId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;