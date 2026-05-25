const asyncHandler = require('express-async-handler');
const HealthLog = require('../models/HealthLog');

/* GET ALL HEALTH LOGS */
const getHealthLogs = asyncHandler(async (req, res) => {

  const logs = await HealthLog.find().sort({ date: -1 });

  res.status(200).json(logs);

});

/* ADD HEALTH LOG */
const addHealthLog = asyncHandler(async (req, res) => {

  const {
    workoutMinutes,
    caloriesBurned,
    caloriesConsumed,
    sleepHours,
    waterGlasses,
    mood,
    date,
  } = req.body;

  const log = await HealthLog.create({
    workoutMinutes,
    caloriesBurned,
    caloriesConsumed,
    sleepHours,
    waterGlasses,
    mood,
    date: date || Date.now(),
  });

  res.status(201).json(log);

});

module.exports = {
  getHealthLogs,
  addHealthLog,
};