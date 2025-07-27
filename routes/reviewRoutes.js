const express = require('express');
const router = express.Router();
const { createReview, getSupplierReviews } = require('../controllers/reviewController');
const protectHandler = require('../middleware/protectHandler');

// Buyer creates a review
router.post('/', protectHandler, createReview);

// Anyone can view reviews for a supplier
router.get('/supplier/:supplierId', getSupplierReviews);

module.exports = router;
