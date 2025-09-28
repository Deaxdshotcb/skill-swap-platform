const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { skill_id, experience_level } = req.body;
    try {
        const newOffer = { user_id: req.user.id, skill_id, experience_level };
        await db.query('INSERT INTO skill_offers SET ?', newOffer);
        res.json({ msg: 'Offer created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const [offers] = await db.query(`
            SELECT so.id, s.name as skill_name, so.experience_level 
            FROM skill_offers so 
            JOIN skills s ON so.skill_id = s.id 
            WHERE so.user_id = ?`, [req.user.id]);
        res.json(offers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;