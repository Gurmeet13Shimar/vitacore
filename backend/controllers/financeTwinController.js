const FinanceTwin = require('../models/FinanceTwin');
const Expense = require('../models/Expense');
const axios = require('axios');
const mongoose = require('mongoose');

const ML_SERVICE_URL = 'http://127.0.0.1:8000';

const getCurrentSavings = async (userId) => {
  const User = require('../models/User');
  const user = await User.findById(userId);
  const profileIncome = user ? user.income : 0;

  const totalHistory = await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);
  
  let totalIncome = 0;
  let totalExpense = 0;
  totalHistory.forEach(e => {
    if (e._id === 'Income') totalIncome = e.total;
    if (e._id === 'Expense') totalExpense = e.total;
  });
  
  let currentSavings = 0;
  if (totalHistory.length > 0) {
    currentSavings = totalIncome - totalExpense;
  }
  if (currentSavings <= 0) {
    currentSavings = profileIncome || 12073.80;
  }
  return currentSavings;
};

const getOverview = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const profileIncome = user ? user.income : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await Expense.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    
    monthlyStats.forEach(e => {
      if (e._id === 'Income') monthlyIncome = e.total;
      if (e._id === 'Expense') monthlyExpenses = e.total;
    });

    if (monthlyIncome === 0) {
      monthlyIncome = profileIncome || 12073.80;
    }

    const currentSavings = await getCurrentSavings(req.user.id);
    const savingsRate = monthlyIncome > 0 ? (((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100).toFixed(2) : 0;

    let twin = await FinanceTwin.findOne({ user: req.user.id });
    if (!twin) {
      twin = await FinanceTwin.create({ user: req.user.id });
    }

    res.status(200).json({
      currentSavings,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      history: twin
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Forecast
// @route   POST /api/finance/twin/forecast
// @access  Private
const getForecast = async (req, res) => {
  try {
    const currentSavings = await getCurrentSavings(req.user.id);
    
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-finance-forecast`, {
      currentSavings
    });
    
    if (mlResponse.data.error) {
       return res.status(400).json({ message: mlResponse.data.error });
    }

    const twin = await FinanceTwin.findOneAndUpdate(
      { user: req.user.id },
      { 
        user: req.user.id,
        forecastResults: {
          ...mlResponse.data,
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forecast from ML service', error: error.message });
  }
};

// @desc    Simulate Finance Scenario
// @route   POST /api/finance/twin/simulate
// @access  Private
const simulateFinance = async (req, res) => {
  try {
    const { foodReductionPercent, shoppingReductionPercent, transportReductionPercent, incomeIncreaseAmount } = req.body;
    const currentSavings = await getCurrentSavings(req.user.id);

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/simulate-finance`, {
      currentSavings,
      foodReductionPercent: foodReductionPercent || 0,
      shoppingReductionPercent: shoppingReductionPercent || 0,
      transportReductionPercent: transportReductionPercent || 0,
      incomeIncreaseAmount: incomeIncreaseAmount || 0
    });

    if (mlResponse.data.error) {
      return res.status(400).json({ message: mlResponse.data.error });
    }

    const simRecord = {
      foodReductionPercent,
      shoppingReductionPercent,
      transportReductionPercent,
      incomeIncreaseAmount,
      baseline90DaySavings: mlResponse.data.baseline90DaySavings,
      optimized90DaySavings: mlResponse.data.optimized90DaySavings,
      additionalSavings: mlResponse.data.additionalSavings
    };

    await FinanceTwin.findOneAndUpdate(
      { user: req.user.id },
      { $push: { simulationHistory: simRecord } },
      { new: true, upsert: true }
    );

    res.status(200).json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ message: 'Error simulating scenario', error: error.message });
  }
};

// @desc    Get Optimization Recommendations
// @route   POST /api/finance/twin/optimize
// @access  Private
const getOptimizations = async (req, res) => {
  try {
    const currentSavings = await getCurrentSavings(req.user.id);

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/optimize-finance`, {
      currentSavings
    });

    if (mlResponse.data.error) {
      return res.status(400).json({ message: mlResponse.data.error });
    }

    await FinanceTwin.findOneAndUpdate(
      { user: req.user.id },
      { $push: { optimizationHistory: { optimizations: mlResponse.data.optimizations } } },
      { new: true, upsert: true }
    );

    res.status(200).json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ message: 'Error getting optimizations', error: error.message });
  }
};

const forecastGoal = async (req, res) => {
  try {
    const { title, targetAmount, optimizedDailySavingsAddition } = req.body;
    const currentSavings = await getCurrentSavings(req.user.id);

    if (currentSavings >= targetAmount) {
      return res.status(200).json({ estimatedCompletionDays: 0, optimizedCompletionDays: 0 });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const profileIncome = user ? user.income : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await Expense.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    monthlyStats.forEach(e => {
      if (e._id === 'Income') monthlyIncome = e.total;
      if (e._id === 'Expense') monthlyExpenses = e.total;
    });

    if (monthlyIncome === 0) {
      monthlyIncome = profileIncome || 12073.80;
    }

    let baseDailySavings = (monthlyIncome - monthlyExpenses) / 30;
    if (baseDailySavings <= 0) {
      baseDailySavings = (monthlyIncome * 0.10) / 30;
    }
    baseDailySavings = Math.max(1, baseDailySavings);

    const optimizedDailySavings = baseDailySavings + (optimizedDailySavingsAddition || 0);

    const remaining = targetAmount - currentSavings;
    const estimatedCompletionDays = Math.ceil(remaining / baseDailySavings);
    const optimizedCompletionDays = Math.ceil(remaining / optimizedDailySavings);

    await FinanceTwin.findOneAndUpdate(
      { user: req.user.id },
      { $push: { financialGoals: { title, targetAmount, estimatedCompletionDays, optimizedCompletionDays } } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      estimatedCompletionDays,
      optimizedCompletionDays
    });
  } catch (error) {
    res.status(500).json({ message: 'Error forecasting goal', error: error.message });
  }
};

module.exports = {
  getOverview,
  getForecast,
  simulateFinance,
  getOptimizations,
  forecastGoal
};
