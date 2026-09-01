const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const WellnessSurvey = require('../models/WellnessSurvey');
const SecurityEvent = require('../models/SecurityEvent');
const ResourceUsage = require('../models/ResourceUsage');

// Demo users for all roles
const demoUsers = [
  { name: 'Admin Demo', email: 'admin@demo.com', password: 'admin123', role: 'Admin' },
  { name: 'Dr. Faculty Demo', email: 'faculty@demo.com', password: 'faculty123', role: 'Faculty' },
  { name: 'Student Demo', email: 'student@demo.com', password: 'student123', role: 'Student' },
  { name: 'Alice Johnson', email: 'alice@demo.com', password: 'password123', role: 'Student' },
  { name: 'Bob Smith', email: 'bob@demo.com', password: 'password123', role: 'Student' },
  { name: 'Charlie Lee', email: 'charlie@demo.com', password: 'password123', role: 'Student' },
  { name: 'Diana Patel', email: 'diana@demo.com', password: 'password123', role: 'Student' },
  { name: 'Ethan Brown', email: 'ethan@demo.com', password: 'password123', role: 'Student' },
];

// Demo courses
const demoCourses = [
  { name: 'Computer Science 101', courseCode: 'CS101' },
  { name: 'Data Structures', courseCode: 'CS201' },
  { name: 'Mathematics', courseCode: 'MATH101' },
  { name: 'Physics', courseCode: 'PHYS101' },
  { name: 'Web Development', courseCode: 'CS301' },
];

// Security events for demo
const demoSecurityEvents = [
  { eventType: 'Motion Detected', location: 'Library - Floor 2', priority: 'Low', description: 'Motion sensor triggered in after hours' },
  { eventType: 'Unauthorized Access', location: 'Lab Building - Room 301', priority: 'High', description: 'Access card rejected multiple times' },
  { eventType: 'Fire Alarm', location: 'Main Building', priority: 'Medium', description: 'Smoke detector test completed' },
  { eventType: 'Motion Detected', location: 'Cafeteria', priority: 'Low', description: 'Cleaning crew movement detected' },
  { eventType: 'Emergency Alert', location: 'Campus Grounds', priority: 'High', description: 'Student emergency report' },
];

async function generateComprehensiveDemo(shouldDisconnect = true) {
  try {
    console.log('🚀 Setting up CollegeGuard Demo Data...');
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB');
    }

    // Clear existing data
    console.log('🧹 Clearing existing demo data...');
    await User.deleteMany({ email: { $regex: '@demo.com$' } });
    await Course.deleteMany({});
    await Attendance.deleteMany({});
    await WellnessSurvey.deleteMany({});
    await SecurityEvent.deleteMany({});
    await ResourceUsage.deleteMany({});

    // Create demo users
    console.log('👥 Creating demo users...');
    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`   ✓ Created ${userData.role}: ${userData.email}`);
    }

    // Create demo courses
    console.log('📚 Creating demo courses...');
    const createdCourses = [];
    for (const courseData of demoCourses) {
      const course = await Course.create(courseData);
      createdCourses.push(course);
      console.log(`   ✓ Created course: ${course.name}`);
    }

    // FIXED: Create course attendance records with proper field mapping
    console.log('📋 Creating course attendance records...');
    const students = createdUsers.filter(u => u.role === 'Student');
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      for (const student of students) {
        for (const course of createdCourses.slice(0, 3)) {
          // FIXED: Use consistent field names for course attendance
          await Attendance.create({
            student: student._id,    // For course attendance queries
            user: student._id,       // Required field for the schema
            course: course._id,
            date: date.toISOString().split('T')[0],
            present: Math.random() > 0.15,
            status: Math.random() > 0.15 ? 'Present' : 'Absent'
          });
        }
      }
    }

    // Create entry/exit attendance for today and yesterday
    console.log('🚪 Creating entry/exit records...');
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    // Today's entry/exit records
    for (const user of createdUsers.slice(0, 6)) {
      const entryTime = new Date(todayStart.getTime() + Math.random() * 8 * 60 * 60 * 1000);
      await Attendance.create({
        user: user._id,
        entryTime: entryTime,
        exitTime: Math.random() > 0.4 ? new Date(entryTime.getTime() + (4 + Math.random() * 6) * 60 * 60 * 1000) : null
      });
    }
    
    // Yesterday's entry/exit records (all completed)
    for (const user of createdUsers.slice(0, 7)) {
      const entryTime = new Date(yesterdayStart.getTime() + Math.random() * 8 * 60 * 60 * 1000);
      const exitTime = new Date(entryTime.getTime() + (6 + Math.random() * 4) * 60 * 60 * 1000);
      await Attendance.create({
        user: user._id,
        entryTime: entryTime,
        exitTime: exitTime
      });
    }

    // Create wellness surveys
    console.log('💚 Creating wellness surveys...');
    for (let i = 0; i < 50; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const surveyDate = new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      await WellnessSurvey.create({
        student: randomStudent._id,
        moodRating: Math.floor(Math.random() * 5) + 1,
        comments: [
          'Feeling great today!', 
          'A bit stressed with assignments', 
          'Excellent mood!', 
          '', 
          'Could use some rest',
          'Very happy with progress',
          'Feeling overwhelmed',
          'Good day overall'
        ][Math.floor(Math.random() * 8)],
        createdAt: surveyDate
      });
    }

    // Create security events
    console.log('🔐 Creating security events...');
    for (const eventData of demoSecurityEvents) {
      const eventTime = new Date(today.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      await SecurityEvent.create({
        ...eventData,
        createdAt: eventTime
      });
    }

    // Create resource usage data
    console.log('⚡ Creating resource usage data...');
    const resourceTypes = ['wifi', 'energy', 'water'];
    const units = { wifi: 'GB', energy: 'kWh', water: 'L' };
    
    for (let i = 0; i < 48; i++) { // 48 hours of data
      for (const resourceType of resourceTypes) {
        const timestamp = new Date(today.getTime() - i * 60 * 60 * 1000);
        let usageValue;
        
        switch (resourceType) {
          case 'wifi': 
            usageValue = Math.floor(Math.random() * 500) + 1000;
            break;
          case 'energy': 
            usageValue = Math.floor(Math.random() * 100) + 200;
            break;
          case 'water': 
            usageValue = Math.floor(Math.random() * 50) + 100;
            break;
        }
        
        await ResourceUsage.create({
          resourceType,
          usageValue,
          unit: units[resourceType],
          createdAt: timestamp
        });
      }
    }

    console.log('\n🎉 Demo data generation complete!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('=========================================');
    console.log('   👨‍💼 Admin:   admin@demo.com / admin123');
    console.log('   👩‍🏫 Faculty: faculty@demo.com / faculty123');
    console.log('   👨‍🎓 Student: student@demo.com / student123');
    console.log('\n🔗 Additional Student Accounts:');
    demoUsers.filter(u => u.role === 'Student' && u.email !== 'student@demo.com').forEach(u => {
      console.log(`   👤 ${u.name}: ${u.email} / password123`);
    });
    
    console.log('\n📊 Generated Data Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📚 Courses: ${createdCourses.length}`);
    console.log(`   📋 Course attendance records: ${students.length * 3 * 7}`);
    console.log(`   🚪 Entry/Exit records: ${createdUsers.length * 2}`);
    console.log(`   💚 Wellness surveys: 50`);
    console.log(`   🔐 Security events: ${demoSecurityEvents.length}`);
    console.log(`   ⚡ Resource usage records: ${resourceTypes.length * 48}`);
    
    console.log('\n🚀 Your CollegeGuard system is ready for demo!');
    
    if (shouldDisconnect) {
      mongoose.disconnect();
    }
  } catch (error) {
    console.error('❌ Error generating demo data:', error);
    if (shouldDisconnect) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  generateComprehensiveDemo(true);
}

module.exports = { seedData: () => generateComprehensiveDemo(false) };