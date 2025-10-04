const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET request to fetch all skills
router.get('/', auth, async (req, res) => {
  try {
    const [skills] = await db.query('SELECT * FROM skills ORDER BY name');
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST request to add a new skill
router.post('/', auth, async (req, res) => {
  const { name } = req.body;

  // Basic validation to ensure a name is provided
  if (!name || name.trim() === '') {
    return res.status(400).json({ msg: 'Skill name is required.' });
  }

  try {
    // Check if the skill already exists (case-insensitive check)
    const [existing] = await db.query('SELECT id FROM skills WHERE LOWER(name) = ?', [name.toLowerCase()]);
    
    if (existing.length > 0) {
      return res.status(409).json({ msg: 'This skill already exists.' }); // 409 Conflict
    }

    // Insert the new skill into the database
    const [result] = await db.query('INSERT INTO skills (name) VALUES (?)', [name]);
    const newSkillId = result.insertId;

    // Fetch the newly created skill to send back to the frontend
    const [newSkill] = await db.query('SELECT * FROM skills WHERE id = ?', [newSkillId]);

    // Respond with the new skill object and a 201 "Created" status
    res.status(201).json(newSkill[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;