const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const SecurityEvent = require('../models/SecurityEvent');

async function fixDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update SecurityEvent schema to include missing fields
    console.log('Updating SecurityEvent documents...');
    
    // Add description field to existing security events that don't have it
    const events = await SecurityEvent.find({ description: { $exists: false } });
    
    for (const event of events) {
      event.description = `${event.eventType} detected at ${event.location}`;
      await event.save();
    }

    console.log(`Updated ${events.length} security events with descriptions`);
    
    // Fix any other potential schema issues
    console.log('Database fixes complete!');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();