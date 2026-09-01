const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Use absolute path

const mongoose = require('mongoose');
const User = require('../models/User');

console.log('MONGO_URI:', process.env.MONGO_URI); // Debug: Should print your connection string

const fakeStudents = [
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'Student' },
  { name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'Student' },
  { name: 'Charlie Lee', email: 'charlie@example.com', password: 'password123', role: 'Student' },
  { name: 'Diana Patel', email: 'diana@example.com', password: 'password123', role: 'Student' },
  { name: 'Ethan Brown', email: 'ethan@example.com', password: 'password123', role: 'Student' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany({ role: 'Student' }); // FIXED: Capital 'S'
    for (const student of fakeStudents) {
      const user = new User(student);
      await user.save();
    }
    console.log('Fake students added!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding students:', error);
    process.exit(1);
  }
}

seed();