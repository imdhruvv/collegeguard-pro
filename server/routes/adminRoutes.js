const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Placeholder admission controller functions
const createAdmission = async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    
    // For demo - simulate admission creation
    const newAdmission = {
      id: Date.now(),
      name,
      email,
      role,
      department,
      studentId: role === 'Student' ? `STU${Date.now().toString().slice(-6)}` : undefined,
      employeeId: role === 'Faculty' ? `FAC${Date.now().toString().slice(-6)}` : undefined,
      rfidCardId: `RFID${Date.now().toString().slice(-8)}`,
      createdAt: new Date(),
      biometricEnrolled: true
    };
    
    console.log('New admission created:', newAdmission);
    
    res.status(201).json({
      message: `${role} admission completed successfully`,
      admission: newAdmission
    });
    
  } catch (error) {
    console.error('Admission error:', error);
    res.status(500).json({ message: 'Failed to complete admission' });
  }
};

const getRecentAdmissions = async (req, res) => {
  try {
    // Mock recent admissions for demo
    const mockAdmissions = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@demo.com',
        role: 'Student',
        department: 'Computer Science',
        studentId: 'STU001',
        createdAt: new Date(),
        biometricEnrolled: true
      },
      {
        id: 2,
        name: 'Dr. Bob Smith', 
        email: 'bob@demo.com',
        role: 'Faculty',
        department: 'Mathematics',
        employeeId: 'FAC001',
        createdAt: new Date(),
        biometricEnrolled: true
      }
    ];
    
    res.json(mockAdmissions);
  } catch (error) {
    console.error('Get admissions error:', error);
    res.status(500).json({ message: 'Failed to get recent admissions' });
  }
};

// Admin only routes
router.post('/create', protect, isAdmin, createAdmission);
router.get('/recent', protect, isAdmin, getRecentAdmissions);

module.exports = router;