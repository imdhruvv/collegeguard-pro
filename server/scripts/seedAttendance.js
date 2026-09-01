const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');

async function seedAttendance() {
  await mongoose.connect(process.env.MONGO_URI);

  // Get all students
  const students = await User.find({ role: 'Student' });

  // Get or create a course
  let course = await Course.findOne();
  if (!course) {
    course = await Course.create({
      name: 'Demo Course',
      courseCode: 'DEMO101', // <-- FIXED: use courseCode, not code
      instructor: 'Demo Faculty'
    });
  }

  // Create fake attendance for the last 5 days
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    for (const student of students) {
      await Attendance.create({
        student: student._id,
        course: course._id,
        date: date.toISOString().slice(0, 10),
        status: Math.random() > 0.2 ? 'Present' : 'Absent'
      });
    }
  }

  console.log('Fake attendance records added!');
  mongoose.disconnect();
}

seedAttendance();