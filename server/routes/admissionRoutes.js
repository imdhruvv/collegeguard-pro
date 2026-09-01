const express = require('express');
const router = express.Router();
const { createAdmission, getRecentAdmissions } = require('../controllers/admissionController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/create', protect, isAdmin, createAdmission);
router.get('/recent', protect, isAdmin, getRecentAdmissions);

module.exports = router;
