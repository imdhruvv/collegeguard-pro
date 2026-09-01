const express = require('express');
const router = express.Router();
const { getSecurityEvents, createSecurityEvent } = require('../controllers/securityController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// FIXED: Public emergency endpoint (no auth required for student emergency button)
router.route('/emergency').post(createSecurityEvent);

// Admin-only routes
router.route('/').get(protect, isAdmin, getSecurityEvents);
router.route('/').post(protect, isAdmin, createSecurityEvent);

module.exports = router;