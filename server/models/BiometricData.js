const mongoose = require('mongoose');

const biometricDataSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  fingerprints: [{
    fingerprintId: String,
    template: String, // Base64 encoded fingerprint template
    quality: Number,
    enrolledAt: { type: Date, default: Date.now }
  }],
  faceTemplate: String, // For future face recognition
  isActive: { type: Boolean, default: true },
  lastVerified: Date,
  verificationCount: { type: Number, default: 0 },
  failedAttempts: { type: Number, default: 0 },
  enrolledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('BiometricData', biometricDataSchema);