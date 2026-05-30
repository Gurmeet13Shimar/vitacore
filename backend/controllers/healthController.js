const HealthLog = require('../models/HealthLog');
const axios = require('axios');

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

// @desc    Get nutrition data from CalorieNinjas API
// @route   GET /api/health/nutrition
// @access  Private
const getNutritionDetails = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const response = await axios.get(
      `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'X-Api-Key': process.env.CALORIE_NINJAS_KEY
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('CalorieNinjas proxy error:', error.message);
    res.status(500).json({ message: 'Error fetching nutrition details from CalorieNinjas' });
  }
};

module.exports = { getHealthLogs, addHealthLog, getNutritionDetails };
