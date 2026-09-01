const express = require('express');
const router = express.Router();
const { logEntry, logExit, getTodayAttendance, markAttendance, getCourseStudents } = require('../controllers/attendanceController');

router.post('/entry', logEntry);
router.post('/exit', logExit);
router.get('/today', getTodayAttendance);
router.get('/course/:courseId/students', getCourseStudents);
router.post('/course/:courseId/mark', markAttendance);

module.exports = router;