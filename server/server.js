const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased for biometric data
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Trust proxy for getting real IP addresses
app.set('trust proxy', true);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Make io available to routes for real-time events
app.set('io', io);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CollegeGuard Pro API - Anti-Proxy Biometric System',
    version: '2.0.0',
    features: [
      'Biometric Fingerprint Authentication',
      'QR Code Fallback System', 
      'Faculty 48-hour Edit Window',
      'Admin New Admissions Portal',
      'Real-time Security Monitoring'
    ],
    status: 'Active',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/performance', require('./routes/performanceRoutes'));
app.use('/api/security', require('./routes/securityRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/wellness', require('./routes/wellnessRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));

// NEW ENHANCED ROUTES
app.use('/api/biometric', require('./routes/biometricRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));

// Socket.IO connection handling for real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join room based on user role
  socket.on('join_room', (data) => {
    const { userId, role } = data;
    socket.join(role); // Join role-based room (Admin, Faculty, Student)
    socket.join(`user_${userId}`); // Join user-specific room
    console.log(`User ${userId} (${role}) joined rooms`);
  });
  
  // Handle biometric scan events
  socket.on('biometric_scan_start', (data) => {
    console.log('Biometric scan started for user:', data.userId);
    // Notify admins about biometric scan activity
    socket.to('Admin').emit('biometric_activity', {
      type: 'scan_start',
      userId: data.userId,
      timestamp: new Date(),
      scannerLocation: data.location || 'Unknown'
    });
  });
  
  socket.on('biometric_scan_complete', (data) => {
    console.log('Biometric scan completed:', data.success ? 'SUCCESS' : 'FAILED');
    
    // If biometric fails multiple times, alert security
    if (!data.success && data.failureCount > 3) {
      io.to('Admin').emit('security_alert', {
        type: 'Multiple Biometric Failures',
        severity: 'HIGH',
        userId: data.userId,
        location: data.location,
        failureCount: data.failureCount,
        timestamp: new Date()
      });
    }
  });
  
  // Handle faculty attendance edit requests
  socket.on('attendance_edit_request', (data) => {
    // Notify relevant admins about attendance modifications
    socket.to('Admin').emit('attendance_modified', {
      facultyId: data.facultyId,
      studentId: data.studentId,
      courseId: data.courseId,
      oldStatus: data.oldStatus,
      newStatus: data.newStatus,
      timestamp: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Enhanced mock IoT data generator for hackathon demo
setInterval(() => {
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 8 && currentHour <= 18;
  
  const mockData = {
    timestamp: new Date(),
    // Resource usage
    electricity: Math.floor(Math.random() * 100) + (isBusinessHours ? 300 : 150),
    water: Math.floor(Math.random() * 50) + (isBusinessHours ? 150 : 80),
    wifi: Math.floor(Math.random() * 500) + (isBusinessHours ? 2000 : 500),
    
    // Security and biometric metrics
    activeBiometricScanners: 8 - Math.floor(Math.random() * 2), // 6-8 active
    totalScansToday: Math.floor(Math.random() * 50) + 200,
    successfulScans: Math.floor(Math.random() * 45) + 180,
    failedBiometricAttempts: Math.floor(Math.random() * 15) + 5,
    qrFallbackUsage: Math.floor(Math.random() * 20) + 10,
    
    // Campus access
    rfidReaders: 12,
    activeDoorSensors: 24 - Math.floor(Math.random() * 3),
    securityCameras: 32,
    emergencyButtons: 16,
    
    // Attendance metrics
    studentsOnCampus: isBusinessHours ? Math.floor(Math.random() * 500) + 800 : Math.floor(Math.random() * 100) + 50,
    facultyOnCampus: isBusinessHours ? Math.floor(Math.random() * 30) + 45 : Math.floor(Math.random() * 10) + 5,
    
    // Anti-proxy detection
    suspiciousPatterns: Math.floor(Math.random() * 3),
    proxiesBlocked: Math.floor(Math.random() * 5),
    geofenceViolations: Math.floor(Math.random() * 2)
  };
  
  io.emit('resourceUpdate', mockData);
  
  // Simulate security alerts (demo purposes)
  if (Math.random() < 0.08) { // 8% chance every 5 seconds for demo
    const alertTypes = [
      {
        type: 'Biometric Failure Pattern',
        description: 'Multiple failed biometric scans detected from same location',
        priority: 'High',
        location: 'Main Building - Scanner 3'
      },
      {
        type: 'Proxy Attendance Blocked',
        description: 'Attendance attempt from unauthorized location blocked',
        priority: 'High',
        location: 'Off-Campus IP detected'
      },
      {
        type: 'QR Fallback Overuse',
        description: 'User has used QR fallback method 5+ times this week',
        priority: 'Medium',
        location: 'Library Building'
      },
      {
        type: 'Geofence Violation',
        description: 'Attendance marked outside campus boundaries',
        priority: 'High',
        location: 'GPS coordinates invalid'
      },
      {
        type: 'Device Anomaly',
        description: 'Same device used by multiple users simultaneously',
        priority: 'High',
        location: 'Computer Lab'
      }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    io.emit('securityAlert', {
      eventType: randomAlert.type,
      location: randomAlert.location,
      priority: randomAlert.priority,
      description: randomAlert.description,
      timestamp: new Date(),
      category: 'Anti-Proxy Security'
    });
  }
  
  // Simulate attendance updates
  if (Math.random() < 0.15 && isBusinessHours) { // 15% chance during business hours
    const attendanceUpdate = {
      type: Math.random() > 0.5 ? 'entry' : 'exit',
      method: Math.random() > 0.2 ? 'biometric' : 'qr_fallback',
      success: Math.random() > 0.1, // 90% success rate
      location: ['Main Gate', 'Library Entrance', 'Lab Building', 'Cafeteria'][Math.floor(Math.random() * 4)],
      timestamp: new Date()
    };
    
    io.emit('attendanceUpdate', attendanceUpdate);
  }
}, 5000); // Update every 5 seconds for active demo

// Generate periodic reports for admins (every 30 minutes for demo)
setInterval(() => {
  const reportData = {
    type: 'security_summary',
    timeRange: 'last_30_minutes',
    data: {
      totalBiometricScans: Math.floor(Math.random() * 100) + 50,
      successRate: (Math.random() * 10 + 85).toFixed(1) + '%',
      fallbackUsage: Math.floor(Math.random() * 20) + 5,
      proxiesBlocked: Math.floor(Math.random() * 8) + 2,
      suspiciousActivity: Math.floor(Math.random() * 3),
      peakUsageTime: new Date(Date.now() - Math.random() * 1800000).toLocaleTimeString()
    },
    generatedAt: new Date()
  };
  
  io.to('Admin').emit('periodic_report', reportData);
}, 30 * 60 * 1000); // 30 minutes

// Middleware for request logging with security focus
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  
  // Log biometric and attendance-related requests
  if (req.path.includes('/biometric') || req.path.includes('/attendance')) {
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip}`);
    
    // Check for suspicious patterns (demo)
    if (req.headers['x-forwarded-for'] || req.headers['x-real-ip']) {
      console.log('Proxy detected in security-sensitive request');
    }
  }
  
  next();
});

// Enhanced error handling with security event logging
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err.stack);
  
  // Log security-related errors
  if (err.message.includes('biometric') || 
      err.message.includes('attendance') || 
      err.message.includes('admission')) {
    
    // Create security event (fire and forget)
    const SecurityEvent = require('./models/SecurityEvent');
    SecurityEvent.create({
      eventType: 'System Error',
      location: 'Server',
      priority: 'Medium',
      description: `API Error in ${req.path}: ${err.message.substring(0, 200)}`
    }).catch(console.error);
    
    // Notify admins of critical errors
    if (err.message.includes('biometric') && req.app.get('io')) {
      req.app.get('io').to('Admin').emit('system_error', {
        type: 'biometric_system_error',
        message: err.message,
        endpoint: req.path,
        timestamp: new Date()
      });
    }
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: timestamp
  });
});



// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('==========================================');
  console.log(`🚀 CollegeGuard Pro Server running on port ${PORT}`);
  console.log('🔐 Anti-Proxy Biometric System Active');
  console.log('👆 Biometric scanners initialized');
  console.log('📡 Real-time monitoring enabled');
  console.log('⚡ Socket.IO ready for live updates');
  console.log('🛡️  Security event logging active');
  console.log('📱 Faculty edit window: 48 hours');
  console.log('🎯 Hackathon Demo Mode: ON');
  console.log('==========================================');
  
  // Initialize demo data reminder
  if (process.env.NODE_ENV === 'development') {
    console.log('💡 Remember to run: node scripts/generateComprehensiveDemo.js');
  }
});