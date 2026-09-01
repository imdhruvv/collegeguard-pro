const express = require('express');
const router = express.Router();
const { submitSurvey, getSurveyResults } = require('../controllers/wellnessController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/submit').post(protect, submitSurvey);
router.route('/results').get(protect, isAdmin, getSurveyResults);

module.exports = router;
