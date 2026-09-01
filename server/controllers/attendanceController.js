const User = require('../models/User');
const Attendance = require('../models/Attendance');

exports.logEntry = async (req, res) => {
  try {
    const { userId } = req.body;
    const entry = await Attendance.create({ user: userId, entryTime: new Date() });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.logExit = async (req, res) => {
  try {
    const { userId } = req.body;
    const attendance = await Attendance.findOne({ user: userId, exitTime: null }).sort({ entryTime: -1 });
    if (!attendance) return res.status(404).json({ message: 'No active entry found' });
    attendance.exitTime = new Date();
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const records = await Attendance.find({ entryTime: { $gte: today } }).populate('user');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await User.find({ courses: courseId, role: 'student' });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { attendanceList, date } = req.body; // [{ studentId, present }]
    const results = [];
    for (const record of attendanceList) {
      const att = await Attendance.findOneAndUpdate(
        { user: record.studentId, course: courseId, date },
        { present: record.present, date, course: courseId, user: record.studentId },
        { upsert: true, new: true }
      );
      results.push(att);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};