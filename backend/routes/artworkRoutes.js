const express = require('express');
const router = express.Router();
const {
  getAllArtworks,
  getArtworksWithArtist,
  createArtwork,
  updateArtworkStatus,
  getApprovedArtworks,
  deleteArtwork,
  getArtworksByArtist,
  getArtworkById
} = require('../controllers/artworkController');

// IMPORTANT: Static routes MUST come before dynamic /:id routes

// GET /api/artworks - all artworks
router.get('/', getAllArtworks);

// GET /api/artworks/approved - approved artworks only (MUST be before /:id)
router.get('/approved', getApprovedArtworks);

// GET /api/artworks/artist - artworks with artist details (MUST be before /:id)
router.get('/artist', getArtworksWithArtist);

// GET /api/artworks/artist/:userId - artworks by specific artist
router.get('/artist/:userId', getArtworksByArtist);

// POST /api/artworks - create new artwork
router.post('/', createArtwork);

// GET /api/artworks/:id - single artwork with full details
router.get('/:id', getArtworkById);

// PUT /api/artworks/:id - update approval status
router.put('/:id', updateArtworkStatus);

// DELETE /api/artworks/:id - delete artwork
router.delete('/:id', deleteArtwork);

module.exports = router;

