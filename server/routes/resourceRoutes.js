const express = require('express');
const router = express.Router();
const { getResourceUsage, logResourceUsage } = require('../controllers/resourceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/:resourceType').get(protect, isAdmin, getResourceUsage);
router.route('/').post(protect, isAdmin, logResourceUsage);

module.exports = router;
