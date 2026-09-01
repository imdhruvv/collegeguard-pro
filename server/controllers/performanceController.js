const Attendance = require('../models/Attendance');
const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendanceRecords = await Attendance.find({ student: studentId }).populate('course', 'name courseCode');
    res.json({ attendance: attendanceRecords });
  } catch (error) { res.status(500).json({ message: 'Server Error' }) }
};
module.exports = { getStudentPerformance };
