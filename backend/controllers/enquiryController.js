const { pool } = require('../db');

// POST /api/enquiry - create enquiry
const createEnquiry = async (req, res) => {
  try {
    const { user_id, artwork_id, message } = req.body;

    // Validation
    if (!artwork_id || !message) {
      return res.status(400).json({
        success: false,
        error: 'artwork_id and message required'
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      });
    }

    // Check artwork exists
    const [artworks] = await pool.execute(
      'SELECT artwork_id FROM artwork WHERE artwork_id = ?',
      [artwork_id]
    );

    if (artworks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO enquiry (user_id, artwork_id, message, status) VALUES (?, ?, ?, "pending")',
      [user_id, artwork_id, message]
    );

    res.status(201).json({
      success: true,
      message: 'Enquiry created successfully',
      data: {
        enquiry_id: result.insertId,
        artwork_id,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Enquiry creation error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET /api/enquiry - all enquiries
const getAllEnquiries = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT e.*, u.name, a.title as artwork_title
      FROM enquiry e
      JOIN user u ON e.user_id = u.user_id
      LEFT JOIN artwork a ON e.artwork_id = a.artwork_id
      ORDER BY e.created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries
};

