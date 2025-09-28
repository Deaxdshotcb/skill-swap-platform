const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// --- NEW ROUTE ADDED HERE ---
// @route   GET api/users/me
// @desc    Get the logged-in user's own profile
router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        // Get user's basic info
        const [userRows] = await db.query('SELECT id, username, bio, created_at FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userProfile = userRows[0];
        // Get the skills the user offers
        const [offers] = await db.query(`
            SELECT s.id, s.name, so.experience_level 
            FROM skill_offers so 
            JOIN skills s ON so.skill_id = s.id 
            WHERE so.user_id = ?`, [userId]);
        userProfile.skills_offered = offers;
        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/users/:id
// @desc    Get user profile by ID (for viewing anyone's profile)
router.get('/:id', auth, async (req, res) => {
    try {
        const [userRows] = await db.query('SELECT id, username, bio, created_at FROM users WHERE id = ?', [req.params.id]);
        if (userRows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userProfile = userRows[0];
        const [offers] = await db.query(`
            SELECT s.id, s.name, so.experience_level 
            FROM skill_offers so 
            JOIN skills s ON so.skill_id = s.id 
            WHERE so.user_id = ?`, [req.params.id]);
        userProfile.skills_offered = offers;
        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/me
// @desc    Update the logged-in user's profile
router.put('/me', auth, async (req, res) => {
    const { username, bio } = req.body;
    const userId = req.user.id;
    try {
        await db.query('UPDATE users SET username = ?, bio = ? WHERE id = ?', [username, bio, userId]);
        res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;