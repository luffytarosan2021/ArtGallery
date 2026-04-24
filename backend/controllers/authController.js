const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required'
      });
    }

    // Find user by email
    const [users] = await pool.execute(
      'SELECT user_id, name, email, password, role FROM user WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = users[0];

// TEMP: Skip bcrypt for plaintext DB passwords
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, password, and role are required'
      });
    }

    // Validate role
    if (!['admin', 'artist', 'visitor'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be one of: admin, artist, visitor'
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT user_id FROM user WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // TEMP: Store plaintext password (should use bcrypt in production)
    const hashedPassword = password; // TODO: Use bcrypt.hash() in production

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO user (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, 'active']
    );

    const userId = result.insertId;

    // Create artist profile if role is artist
    if (role === 'artist') {
      await pool.execute(
        'INSERT INTO artist (user_id, bio, verified_status) VALUES (?, ?, ?)',
        [userId, '', 'unverified']
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// POST /api/auth/verify
const verify = async (req, res) => {
  try {
    // The auth middleware already verified the token and set req.user with JWT payload
    // Fetch full user data from database
    const [users] = await pool.execute(
      'SELECT user_id, name, email, role FROM user WHERE user_id = ? AND status = ?',
      [req.user.userId, 'active']
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during verification'
    });
  }
};

const createArtistProfile = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      });
    }

    // Check if artist profile already exists
    const [existing] = await pool.execute(
      'SELECT artist_id FROM artist WHERE user_id = ?',
      [user_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Artist profile already exists'
      });
    }

    // Create artist profile
    const [result] = await pool.execute(
      'INSERT INTO artist (user_id, bio, verified_status) VALUES (?, ?, ?)',
      [user_id, '', 'unverified']
    );

    res.status(201).json({
      success: true,
      message: 'Artist profile created successfully',
      artist_id: result.insertId
    });
  } catch (err) {
    console.error('Create artist profile error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { login, register, verify, createArtistProfile };

