const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, isFacultyOrAdmin } = require('../middleware/authMiddleware');
router.route('/').get(protect, isFacultyOrAdmin, getAllUsers);
module.exports = router;
