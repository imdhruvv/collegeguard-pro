const BiometricData = require('../models/BiometricData');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Enroll biometric data for a user
const enrollBiometric = async (req, res) => {
  try {
    const { userId, fingerprints, quality } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete existing biometric data if any
    await BiometricData.findOneAndDelete({ userId });
    
    // Create new biometric data
    const biometricData = new BiometricData({
      userId,
      fingerprints: fingerprints.map(fp => ({
        fingerprintId: fp.id || `FP_${Date.now()}_${Math.random()}`,
        template: fp.template || fp, // Base64 template
        quality: quality || 85,
        enrolledAt: new Date()
      })),
      enrolledBy: req.user._id
    });
    
    await biometricData.save();
    
    res.status(201).json({
      message: 'Biometric enrollment successful',
      biometricId: biometricData._id,
      fingerprintCount: biometricData.fingerprints.length
    });
    
  } catch (error) {
    console.error('Biometric enrollment error:', error);
    res.status(500).json({ message: 'Biometric enrollment failed' });
  }
};

// Verify biometric and log entry
const biometricEntry = async (req, res) => {
  try {
    const { userId, biometricData, fallbackUsed, qrCode, location, deviceInfo } = req.body;
    
    let biometricVerified = false;
    let fingerprintQuality = 0;
    let fallbackReason = null;
    
    if (!fallbackUsed && biometricData) {
      // Simulate biometric verification
      const storedBiometric = await BiometricData.findOne({ userId });
      if (storedBiometric && storedBiometric.isActive) {
        biometricVerified = Math.random() > 0.1; // 90% success rate
        fingerprintQuality = biometricData.quality || 0;
        
        // Update verification count
        storedBiometric.lastVerified = new Date();
        storedBiometric.verificationCount += 1;
        if (!biometricVerified) {
          storedBiometric.failedAttempts += 1;
        }
        await storedBiometric.save();
      } else {
        fallbackReason = 'No biometric data enrolled';
      }
    } else {
      fallbackReason = 'Biometric scanner failed';
    }
    
    // Check for existing active entry
    const existingEntry = await Attendance.findOne({
      user: userId,
      exitTime: null,
      entryTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });
    
    if (existingEntry) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    
    // Create new entry log
    const attendanceLog = new Attendance({
      user: userId,
      entryTime: new Date(),
      verificationMethod: fallbackUsed ? 'qr_fallback' : 'biometric',
      biometricVerified,
      fingerprintQuality,
      fallbackReason,
      location,
      deviceInfo: deviceInfo || {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        deviceId: req.headers['x-device-id'] || 'unknown'
      }
    });
    
    await attendanceLog.save();
    await attendanceLog.populate('user', 'name email role');
    
    // Emit real-time update
    if (req.app && req.app.get('io')) {
      req.app.get('io').emit('attendanceUpdate', {
        type: 'entry',
        user: attendanceLog.user,
        method: attendanceLog.verificationMethod,
        biometricVerified: biometricVerified,
        timestamp: attendanceLog.entryTime
      });
    }
    
    res.status(201).json({
      message: 'Entry logged successfully',
      attendanceId: attendanceLog._id,
      entryTime: attendanceLog.entryTime,
      verificationMethod: attendanceLog.verificationMethod,
      biometricVerified: biometricVerified
    });
    
  } catch (error) {
    console.error('Biometric entry error:', error);
    res.status(500).json({ message: 'Failed to log entry' });
  }
};

// Verify biometric and log exit
const biometricExit = async (req, res) => {
  try {
    const { userId, biometricData, fallbackUsed, location, deviceInfo } = req.body;
    
    // Find active entry
    const activeEntry = await Attendance.findOne({
      user: userId,
      exitTime: null,
      entryTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ entryTime: -1 });
    
    if (!activeEntry) {
      return res.status(404).json({ message: 'No active entry found. Please check in first.' });
    }
    
    let biometricVerified = false;
    let fingerprintQuality = 0;
    
    if (!fallbackUsed && biometricData) {
      const storedBiometric = await BiometricData.findOne({ userId });
      if (storedBiometric && storedBiometric.isActive) {
        biometricVerified = Math.random() > 0.1; // 90% success rate
        fingerprintQuality = biometricData.quality || 0;
        
        storedBiometric.lastVerified = new Date();
        storedBiometric.verificationCount += 1;
        if (!biometricVerified) {
          storedBiometric.failedAttempts += 1;
        }
        await storedBiometric.save();
      }
    }
    
    // Update entry with exit time
    activeEntry.exitTime = new Date();
    if (!fallbackUsed) {
      activeEntry.verificationMethod = 'biometric';
      activeEntry.biometricVerified = biometricVerified;
      activeEntry.fingerprintQuality = fingerprintQuality;
    }
    
    await activeEntry.save();
    await activeEntry.populate('user', 'name email role');
    
    // Calculate total time on campus
    const totalTime = activeEntry.exitTime - activeEntry.entryTime;
    const hours = Math.floor(totalTime / (1000 * 60 * 60));
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    
    // Emit real-time update
    if (req.app && req.app.get('io')) {
      req.app.get('io').emit('attendanceUpdate', {
        type: 'exit',
        user: activeEntry.user,
        method: activeEntry.verificationMethod,
        biometricVerified: biometricVerified,
        totalTime: `${hours}h ${minutes}m`,
        timestamp: activeEntry.exitTime
      });
    }
    
    res.json({
      message: 'Exit logged successfully',
      attendanceId: activeEntry._id,
      exitTime: activeEntry.exitTime,
      totalTimeOnCampus: `${hours}h ${minutes}m`,
      biometricVerified: biometricVerified
    });
    
  } catch (error) {
    console.error('Biometric exit error:', error);
    res.status(500).json({ message: 'Failed to log exit' });
  }
};

// Edit attendance (Faculty only, within 48 hours)
const editAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, reason } = req.body;
    const facultyId = req.user._id;
    
    // Check if user is faculty
    if (req.user.role !== 'Faculty') {
      return res.status(403).json({ message: 'Only faculty can edit attendance' });
    }
    
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    // Check if within 48-hour edit window
    const now = new Date();
    const createdTime = attendance.createdAt;
    const timeDiff = now - createdTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff > 48) {
      return res.status(403).json({ 
        message: 'Edit window expired. Attendance can only be edited within 48 hours.' 
      });
    }
    
    // Store original status for history
    const originalStatus = attendance.status;
    
    // Update attendance
    attendance.status = status;
    attendance.present = status === 'Present' || status === 'Late';
    attendance.editedBy = facultyId;
    attendance.editedAt = new Date();
    attendance.editReason = reason;
    attendance.originalStatus = attendance.originalStatus || originalStatus;
    
    // Add to edit history if it exists
    if (attendance.editHistory) {
      attendance.editHistory.push({
        editedBy: facultyId,
        editedAt: new Date(),
        oldStatus: originalStatus,
        newStatus: status,
        reason: reason
      });
    }
    
    await attendance.save();
    await attendance.populate(['user', 'editedBy'], 'name email role');
    
    res.json({
      message: 'Attendance updated successfully',
      attendance: attendance,
      editWindow: hoursDiff < 48
    });
    
  } catch (error) {
    console.error('Edit attendance error:', error);
    res.status(500).json({ message: 'Failed to edit attendance' });
  }
};

// Get attendance records for faculty editing
const getAttendanceForEdit = async (req, res) => {
  try {
    const { courseId, date } = req.query;
    
    if (!courseId || !date) {
      return res.status(400).json({ message: 'Course ID and date are required' });
    }
    
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const attendance = await Attendance.find({
      course: courseId,
      date: { $gte: startDate, $lte: endDate }
    }).populate('user editedBy', 'name email role');
    
    // Add edit window status
    const attendanceWithEditStatus = attendance.map(record => {
      const now = new Date();
      const timeDiff = now - record.createdAt;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      const canEdit = hoursDiff < 48;
      
      return {
        ...record.toObject(),
        canEdit: canEdit,
        timeRemaining: canEdit ? 48 * 60 * 60 * 1000 - timeDiff : 0
      };
    });
    
    res.json(attendanceWithEditStatus);
    
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Failed to retrieve attendance data' });
  }
};

module.exports = {
  enrollBiometric,
  biometricEntry,
  biometricExit,
  editAttendance,
  getAttendanceForEdit
};