const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');

// Generate QR code for attendance
router.post('/generate', protect, (req, res) => {
  const { courseId = 'DEMO101' } = req.body;
  const qrCode = `COURSE_${courseId}_${Date.now()}`;
  
  res.json({ 
    qrCode, 
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min expiry
    message: 'QR Code generated successfully'
  });
});

// Scan QR and mark attendance
router.post('/scan', protect, async (req, res) => {
  try {
    const { qrCode } = req.body;
    const userId = req.user._id;
    
    // Simple QR validation
    if (!qrCode.startsWith('COURSE_')) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }
    
    // Extract timestamp and check if expired (15 minutes)
    const parts = qrCode.split('_');
    const timestamp = parseInt(parts[parts.length - 1]);
    const isExpired = Date.now() - timestamp > 15 * 60 * 1000;
    
    if (isExpired) {
      return res.status(400).json({ message: 'QR code has expired' });
    }
    
    // Check if already marked attendance for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = await Attendance.findOne({
      user: userId,
      entryTime: { $gte: today },
      exitTime: null
    });
    
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }
    
    // Mark attendance
    const attendance = await Attendance.create({
      user: userId,
      entryTime: new Date(),
      status: 'Present'
    });
    
    res.json({ 
      success: true, 
      message: 'Attendance marked successfully!',
      attendance 
    });
    
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ message: 'Error processing QR scan' });
  }
});

module.exports = router;