// routes/matches.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../auth');

// @route   GET api/matches/find
// @desc    Find reciprocal matches for the logged-in user [cite: 38]
router.get('/find', auth, async (req, res) => {
  const currentUserId = req.user.id;
  try {
    // This query finds pairs of users who each request a skill the other offers.
    const sql = `
        SELECT
            u1.user_id AS user1_id,
            u1.username AS user1_username,
            u2.user_id AS user2_id,
            u2.username AS user2_username,
            s1.skill_name AS user1_offers_skill,
            s2.skill_name AS user2_offers_skill
        FROM Skill_Offer o1
        JOIN Skill_Request r1 ON o1.skill_id = r1.skill_id AND o1.user_id != r1.user_id
        JOIN Skill_Offer o2 ON o2.user_id = r1.user_id
        JOIN Skill_Request r2 ON r2.user_id = o1.user_id AND o2.skill_id = r2.skill_id
        JOIN User u1 ON o1.user_id = u1.user_id
        JOIN User u2 ON o2.user_id = u2.user_id
        JOIN Skill s1 ON o1.skill_id = s1.skill_id
        JOIN Skill s2 ON o2.skill_id = s2.skill_id
        WHERE o1.user_id = ?
    `;

    const [matches] = await pool.query(sql, [currentUserId]);

    // Insert new matches into the Match table if they don't exist
    for (const match of matches) {
      const { user1_id, user2_id } = match;
      // Ensure user1_id < user2_id to prevent duplicate pairs (1,2) and (2,1)
      const [u1, u2] = [user1_id, user2_id].sort(); 
      await pool.query(
        'INSERT IGNORE INTO \`Match\` (user_1_id, user_2_id) VALUES (?, ?)',
        [u1, u2]
      );
    }

    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/matches
// @desc    Get all confirmed matches for the user
router.get('/', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const [matches] = await pool.query(
            `SELECT
                m.match_id,
                CASE
                    WHEN m.user_1_id = ? THEN u2.username
                    ELSE u1.username
                END AS other_username,
                CASE
                    WHEN m.user_1_id = ? THEN m.user_2_id
                    ELSE m.user_1_id
                END AS other_user_id
            FROM \`Match\` m
            JOIN User u1 ON m.user_1_id = u1.user_id
            JOIN User u2 ON m.user_2_id = u2.user_id
            WHERE m.user_1_id = ? OR m.user_2_id = ?`,
            [userId, userId, userId, userId]
        );
        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;