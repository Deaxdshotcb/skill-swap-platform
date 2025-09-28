// routes/skills.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// @route   GET api/skills
// @desc    Get all available skills
router.get('/', async (req, res) => {
    try {
        const [skills] = await pool.query('SELECT * FROM Skill ORDER BY skill_name');
        res.json(skills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;