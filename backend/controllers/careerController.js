const StudyLog = require('../models/StudyLog');

// @desc    Get user study logs
// @route   GET /api/career
// @access  Private
const getStudyLogs = async (req, res) => {
  try {
    const logs = await StudyLog.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a study log
// @route   POST /api/career
// @access  Private
const addStudyLog = async (req, res) => {
  try {
    const { topic, durationMinutes, notes, date } = req.body;
    if (!topic || !durationMinutes) {
      return res.status(400).json({ message: 'Please provide topic and duration' });
    }
    const log = await StudyLog.create({
      user: req.user.id,
      date: date || Date.now(),
      topic,
      durationMinutes,
      notes
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getStudyLogs, addStudyLog };
