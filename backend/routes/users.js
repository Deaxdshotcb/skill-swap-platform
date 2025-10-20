const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const [userRows] = await db.query('SELECT id, username, bio, created_at FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userProfile = userRows[0];
        
        // **FIX**: Added 'so.id AS offer_id' to the query
        const [offers] = await db.query(`
            SELECT 
                s.id, 
                s.name, 
                so.experience_level,
                so.id AS offer_id 
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

router.get('/:id', auth, async (req, res) => {
    try {
        const [userRows] = await db.query('SELECT id, username, bio, created_at FROM users WHERE id = ?', [req.params.id]);
        if (userRows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userProfile = userRows[0];
        
        // **FIX**: Also added 'so.id AS offer_id' here for consistency
        const [offers] = await db.query(`
            SELECT 
                s.id, 
                s.name, 
                so.experience_level,
                so.id AS offer_id
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

router.put('/me', auth, async (req, res) => {
    const { username, bio } = req.body;
    await db.query('UPDATE users SET username = ?, bio = ? WHERE id = ?', [username, bio, req.user.id]);
    res.json({ msg: 'Profile updated successfully' });
});

module.exports = router;