const mongoose = require('mongoose');

const resourceUsageSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    required: true,
    enum: ['wifi', 'energy', 'water'],
  },
  usageValue: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., 'GB', 'kWh', 'Liters'
}, { timestamps: true });

module.exports = mongoose.model('ResourceUsage', resourceUsageSchema);
