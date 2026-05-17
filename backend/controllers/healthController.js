const HealthLog = require('../models/HealthLog');

// @desc    Get user health logs
// @route   GET /api/health
// @access  Private
const getHealthLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a health log
// @route   POST /api/health
// @access  Private
const addHealthLog = async (req, res) => {
  try {
    const { workoutMinutes, caloriesBurned, caloriesConsumed, sleepHours, waterGlasses, mood, date } = req.body;
    const log = await HealthLog.create({
      user: req.user.id,
      date: date || Date.now(),
      workoutMinutes,
      caloriesBurned,
      caloriesConsumed,
      sleepHours,
      waterGlasses,
      mood
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getHealthLogs, addHealthLog };
