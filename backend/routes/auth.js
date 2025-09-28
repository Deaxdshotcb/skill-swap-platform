const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/register', async (req, res) => {
    const { username, email, password, bio } = req.body;
    try {
        let [user] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (user.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = { username, email, password: hashedPassword, bio };
        const [result] = await db.query('INSERT INTO users SET ?', newUser);
        const payload = { user: { id: result.insertId } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const user = userRows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;