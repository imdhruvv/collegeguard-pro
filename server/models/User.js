const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'Faculty', 'Student'], default: 'Student' },
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  address: { type: String },
  emergencyContact: { type: String },
  department: { type: String },
  course: { type: String },
  semester: { type: String },
  studentId: { type: String },
  employeeId: { type: String },
  rfidCardId: { type: String },
  securityLevel: { type: String, default: 'Basic' },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  status: { type: String, default: 'Active' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
