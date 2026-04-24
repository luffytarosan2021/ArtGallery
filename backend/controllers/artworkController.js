const { pool } = require('../db');

// GET all artworks
const getAllArtworks = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT artwork_id, category_id, title, price, approval_status 
       FROM artwork`
    );
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

// GET artworks with artist name (JOIN artwork, artist, user)
const getArtworksWithArtist = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.artwork_id, 
        a.category_id, 
        a.title, 
        a.price, 
        a.approval_status,
        u.name AS artist_name,
        ar.bio,
        ar.verified_status
      FROM artwork a
      JOIN artist ar ON a.artist_id = ar.artist_id
      JOIN \`user\` u ON ar.user_id = u.user_id
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

// POST new artwork
const createArtwork = async (req, res) => {
  try {
    const { user_id, category_id, title, price } = req.body;
    // Note: description and image are not stored (not in DB schema)

    // Validation
    if (!title || !price || price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Title and positive price required'
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      });
    }

    // Get artist_id from user_id
    const [artists] = await pool.execute(
      'SELECT artist_id FROM artist WHERE user_id = ?',
      [user_id]
    );

    if (artists.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Artist profile not found. Please contact admin.'
      });
    }

    const artist_id = artists[0].artist_id;

    const [result] = await pool.execute(
      `INSERT INTO artwork (artist_id, category_id, title, price, approval_status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [artist_id, category_id || null, title, price]
    );

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully!',
      data: {
        artwork_id: result.insertId,
        artist_id,
        title,
        price,
        approval_status: 'pending'
      }
    });
  } catch (err) {
    console.error('Artwork creation error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// PUT /api/artworks/:id - update approval status
const updateArtworkStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approval_status } = req.body;

    // Validation
    if (!['approved', 'rejected'].includes(approval_status)) {
      return res.status(400).json({
        success: false,
        error: 'approval_status must be "approved" or "rejected"'
      });
    }

    // Check if artwork exists
    const [existing] = await pool.execute(
      'SELECT artwork_id FROM artwork WHERE artwork_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found'
      });
    }

    const [result] = await pool.execute(
      'UPDATE artwork SET approval_status = ? WHERE artwork_id = ?',
      [approval_status, id]
    );

    res.json({
      success: true,
      message: `Artwork ${id} status updated to "${approval_status}"`,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET approved artworks only
const getApprovedArtworks = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT artwork_id, category_id, title, price, approval_status 
       FROM artwork WHERE approval_status = 'approved'`
    );
    res.status(200).json({
      success: true,
      count: rows.length,
      filtered: 'approved only',
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// DELETE /api/artworks/:id - delete artwork
const deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if exists
    const [existing] = await pool.execute(
      'SELECT artwork_id FROM artwork WHERE artwork_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found'
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM artwork WHERE artwork_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: `Artwork ${id} deleted successfully`,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

const getArtworksByArtist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get artist_id from user_id
    const [artists] = await pool.execute(
      'SELECT artist_id FROM artist WHERE user_id = ?',
      [userId]
    );

    if (artists.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Artist not found'
      });
    }

    const artist_id = artists[0].artist_id;

    const [rows] = await pool.execute(`
      SELECT 
        a.artwork_id, 
        a.category_id, 
        a.title, 
        a.price, 
        a.approval_status,
        c.category_name AS category
      FROM artwork a
      LEFT JOIN category c ON a.category_id = c.category_id
      WHERE a.artist_id = ?
      ORDER BY a.artwork_id DESC
    `, [artist_id]);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error('Get artworks by artist error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET /api/artworks/:id - single artwork with full details
const getArtworkById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT 
        a.artwork_id,
        a.title,
        a.price,
        a.approval_status,
        a.category_id,
        c.category_name AS category,
        ar.artist_id,
        ar.bio,
        ar.verified_status,
        u.name AS artist_name,
        u.user_id
      FROM artwork a
      LEFT JOIN artist ar ON a.artist_id = ar.artist_id
      LEFT JOIN \`user\` u ON ar.user_id = u.user_id
      LEFT JOIN category c ON a.category_id = c.category_id
      WHERE a.artwork_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Artwork not found' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get artwork by id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllArtworks,
  getArtworksWithArtist,
  createArtwork,
  updateArtworkStatus,
  getApprovedArtworks,
  deleteArtwork,
  getArtworksByArtist,
  getArtworkById
};

