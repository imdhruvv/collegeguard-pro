const mongoose = require('mongoose');

const wellnessSurveySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moodRating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, maxlength: 500 },
}, { timestamps: true });

module.exports = mongoose.model('WellnessSurvey', wellnessSurveySchema);
