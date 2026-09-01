const express = require('express');
const router = express.Router();
const { 
  enrollBiometric, 
  biometricEntry, 
  biometricExit, 
  editAttendance, 
  getAttendanceForEdit 
} = require('../controllers/biometricController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Biometric enrollment (Admin only)
router.post('/enroll', protect, isAdmin, enrollBiometric);

// Biometric entry/exit (All authenticated users)
router.post('/entry', protect, biometricEntry);
router.post('/exit', protect, biometricExit);

// Faculty attendance editing
router.get('/attendance', protect, getAttendanceForEdit);
router.put('/attendance/:attendanceId', protect, editAttendance);

module.exports = router;