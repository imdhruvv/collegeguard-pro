// server/models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // For entry/exit tracking
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entryTime: { type: Date },
  exitTime: { type: Date },
  
  // Anti-proxy & Biometric tracking
  verificationMethod: { type: String, enum: ['biometric', 'qr_fallback', 'rfid', 'manual'], default: 'biometric' },
  biometricVerified: { type: Boolean, default: false },
  fingerprintQuality: { type: Number, default: 0 },
  fallbackReason: { type: String },
  location: { type: String, default: 'Main Gate' },
  deviceInfo: { type: mongoose.Schema.Types.Mixed },
  
  // For course attendance
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  date: { type: Date },
  present: { type: Boolean },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
}, { 
  timestamps: true 
});

// Index for better performance
attendanceSchema.index({ user: 1, entryTime: 1 });
attendanceSchema.index({ student: 1, course: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);