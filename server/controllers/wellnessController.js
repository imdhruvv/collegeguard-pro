const WellnessSurvey = require('../models/WellnessSurvey');

// Submit a new survey
const submitSurvey = async (req, res) => {
  const { moodRating, comments } = req.body;
  const studentId = req.user._id; // From 'protect' middleware
  try {
    // Optional: Prevent multiple submissions per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingSubmission = await WellnessSurvey.findOne({ student: studentId, createdAt: { $gte: today } });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted a survey today.' });
    }

    const survey = await WellnessSurvey.create({ student: studentId, moodRating, comments });
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get aggregated survey results (for Admins)
const getSurveyResults = async (req, res) => {
  try {
    const results = await WellnessSurvey.aggregate([
      { $group: { _id: null, averageMood: { $avg: '$moodRating' }, totalSubmissions: { $sum: 1 } } }
    ]);
    res.json(results[0] || { averageMood: 0, totalSubmissions: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitSurvey, getSurveyResults };
