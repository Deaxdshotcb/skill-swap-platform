// routes/offers.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../auth');

// @route   POST api/offers
// @desc    Create a new skill offer [cite: 37]
router.post('/', auth, async (req, res) => {
    const { skill_id, experience_level } = req.body;
    const user_id = req.user.id;

    try {
        const [result] = await pool.query(
            'INSERT INTO Skill_Offer (user_id, skill_id, experience_level) VALUES (?, ?, ?)',
            [user_id, skill_id, experience_level]
        );
        res.json({ msg: 'Offer created successfully', offerId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;