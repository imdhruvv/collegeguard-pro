const express = require('express');
const router = express.Router();
const { exportUsers } = require('../controllers/reportController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, isAdmin, exportUsers);

module.exports = router;
