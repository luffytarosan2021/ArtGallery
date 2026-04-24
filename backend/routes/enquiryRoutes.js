const express = require('express');
const router = express.Router();
const { createEnquiry, getAllEnquiries } = require('../controllers/enquiryController');

// POST /api/enquiry
router.post('/', createEnquiry);

// GET /api/enquiry
router.get('/', getAllEnquiries);

module.exports = router;

