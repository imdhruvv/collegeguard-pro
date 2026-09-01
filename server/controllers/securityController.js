const SecurityEvent = require('../models/SecurityEvent');
const nodemailer = require('nodemailer');

// Configure transporter (use your email for demo, e.g., Gmail with app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL_USER, // Add to your .env
    pass: process.env.ALERT_EMAIL_PASS  // Add to your .env
  }
});

// Get all security events, most recent first
const getSecurityEvents = async (req, res) => {
  try {
    const events = await SecurityEvent.find({}).sort({ createdAt: -1 }).limit(10);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new security event (for simulation)
const createSecurityEvent = async (req, res) => {
  const { eventType, location, priority, description } = req.body;
  try {
    const newEvent = await SecurityEvent.create({ eventType, location, priority, description });

    // ENHANCED: Emit socket event for real-time updates
    if (req.app && req.app.get('io')) {
      const io = req.app.get('io');
      if (eventType === 'Emergency Alert') {
        io.emit('emergencyAlert', newEvent);
      } else {
        io.emit('securityAlert', newEvent);
      }
    }

    // Demo: Log alert instead of sending email
    if (newEvent.priority === 'High') {
      console.log('🚨 DEMO SECURITY ALERT 🚨');
      console.log(`Type: ${newEvent.eventType}`);
      console.log(`Location: ${newEvent.location}`);
      console.log(`Description: ${newEvent.description || 'N/A'}`);
      console.log(`Time: ${newEvent.createdAt}`);
      console.log('-----------------------------');
    }

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating security event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getSecurityEvents, createSecurityEvent };