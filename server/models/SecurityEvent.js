const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  location: { type: String, required: true },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  description: { type: String },
  category: { type: String, default: 'Anti-Proxy Security' }
}, { timestamps: true });

module.exports = mongoose.model('SecurityEvent', securityEventSchema);