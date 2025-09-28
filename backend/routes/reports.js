const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { reported_id, reason } = req.body;
  const reporter_id = req.user.id;

  if (!reported_id || !reason) {
    return res.status(400).json({ msg: 'Please provide the user being reported and a reason.' });
  }
  if (reporter_id.toString() === reported_id.toString()) {
    return res.status(400).json({ msg: 'You cannot report yourself.' });
  }

  try {
    const newReport = { reporter_id, reported_id, reason };
    await db.query('INSERT INTO reports SET ?', newReport);
    res.json({ msg: 'Report submitted successfully. Our team will review it shortly.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;