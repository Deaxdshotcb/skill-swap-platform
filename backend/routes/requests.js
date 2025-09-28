const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { skill_id } = req.body;
    try {
        const newRequest = { user_id: req.user.id, skill_id };
        await db.query('INSERT INTO skill_requests SET ?', newRequest);
        res.json({ msg: 'Request created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT sr.id, s.name as skill_name 
            FROM skill_requests sr 
            JOIN skills s ON sr.skill_id = s.id 
            WHERE sr.user_id = ?`, [req.user.id]);
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;