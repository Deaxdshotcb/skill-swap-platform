const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [adminRows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        if (adminRows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const admin = adminRows[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { admin: { id: admin.id ,username:admin.username} };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/reports', adminAuth, async (req, res) => {
    try {
        const [reports] = await db.query(`
            SELECT 
                r.id, r.reason, r.status, r.created_at,
                reporter.username as reporter_username,
                reported.username as reported_username
            FROM reports r
            JOIN users reporter ON r.reporter_id = reporter.id
            JOIN users reported ON r.reported_id = reported.id
            ORDER BY r.created_at DESC
        `);
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/users/:id/block', adminAuth, async (req, res) => {
    const { reason } = req.body;
    const user_id_to_block = req.params.id;
    const admin_id = req.admin.id;
    try {
        const newBlock = { user_id: user_id_to_block, admin_id, reason };
        await db.query('INSERT INTO blocked_users SET ?', newBlock);
        res.json({ msg: 'User has been blocked successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;