const express = require('express');
const router = express.Router();
const { login, register, verify, createArtistProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/verify (protected route)
router.post('/verify', authMiddleware, verify);

// POST /api/auth/create-artist-profile
router.post('/create-artist-profile', createArtistProfile);

module.exports = router;

