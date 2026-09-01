const express = require('express');
const router = express.Router();
const { getStudentPerformance } = require('../controllers/performanceController');
const { protect } = require('../middleware/authMiddleware');
router.route('/:studentId').get(protect, getStudentPerformance);
module.exports = router;
