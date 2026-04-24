const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users - get all users (admin use)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, name, email, role, status FROM user ORDER BY user_id ASC'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

