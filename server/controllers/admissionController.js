const User = require('../models/User');
const BiometricData = require('../models/BiometricData');

// Create new student/faculty admission
const createAdmission = async (req, res) => {
  try {
    const {
      // Basic info
      name, email, phone, dateOfBirth, gender, address, emergencyContact,
      // Academic info
      role, department, course, semester, studentId, employeeId,
      // Security info
      password, biometricData, rfidCardId, securityLevel
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const userData = {
      name,
      email,
      password,
      role,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address,
      emergencyContact,
      department,
      course: role === 'Student' ? course : undefined,
      semester: role === 'Student' ? semester : undefined,
      studentId: role === 'Student' ? studentId : undefined,
      employeeId: role === 'Faculty' ? employeeId : undefined,
      rfidCardId,
      securityLevel: securityLevel || 'Basic'
    };
    
    const newUser = new User(userData);
    await newUser.save();
    
    // Enroll biometric data if provided
    if (biometricData && biometricData.fingerprints) {
      const biometric = new BiometricData({
        userId: newUser._id,
        fingerprints: biometricData.fingerprints.map((fp, index) => ({
          fingerprintId: `FP_${newUser._id}_${index + 1}`,
          template: fp,
          quality: biometricData.quality || 85,
          enrolledAt: new Date()
        })),
        enrolledBy: req.user._id
      });
      
      await biometric.save();
    }
    
    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: `${role} admission completed successfully`,
      user: userResponse,
      biometricEnrolled: !!biometricData,
      studentId: role === 'Student' ? studentId : undefined,
      employeeId: role === 'Faculty' ? employeeId : undefined,
      rfidCardId: rfidCardId
    });
    
  } catch (error) {
    console.error('Admission error:', error);
    res.status(500).json({ 
      message: 'Failed to complete admission',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Get recent admissions
const getRecentAdmissions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-password');
    
    // Add biometric status
    const usersWithBiometricStatus = await Promise.all(
      recentUsers.map(async (user) => {
        const biometric = await BiometricData.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          biometricEnrolled: !!biometric,
          fingerprintCount: biometric ? biometric.fingerprints.length : 0
        };
      })
    );
    
    res.json(usersWithBiometricStatus);
    
  } catch (error) {
    console.error('Get recent admissions error:', error);
    res.status(500).json({ message: 'Failed to retrieve recent admissions' });
  }
};

module.exports = {
  createAdmission,
  getRecentAdmissions
};