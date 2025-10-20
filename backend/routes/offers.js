const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/offers - Create a new skill offer
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

// GET /api/offers/me - Get the current user's offers (not used in profile but good to have)
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

// --- NEW ROUTE TO DELETE A SKILL OFFER ---
// DELETE /api/offers/:offerId
router.delete('/:offerId', auth, async (req, res) => {
    try {
        const { offerId } = req.params;
        const userId = req.user.id;

        // The query ensures a user can only delete their OWN offers
        const [result] = await db.query(
            'DELETE FROM skill_offers WHERE id = ? AND user_id = ?', 
            [offerId, userId]
        );

        // Check if a row was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Offer not found or you are not authorized to delete it.' });
        }

        res.json({ msg: 'Skill offer removed successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;