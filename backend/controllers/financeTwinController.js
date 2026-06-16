const FinanceTwin = require('../models/FinanceTwin');
const Expense = require('../models/Expense');
const axios = require('axios');
const mongoose = require('mongoose');

const ML_SERVICE_URL = 'http://127.0.0.1:8000';

const getCurrentSavings = async (userId) => {
  const expenses = await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);
  
  let income = 0;
  let spent = 0;
  
  expenses.forEach(e => {
    if (e._id === 'Income') income = e.total;
    if (e._id === 'Expense') spent = e.total;
  });
  
  // Default to something if no history, just for demonstration
  return Math.max(0, income - spent) || 25000;
};

// @desc    Get Finance Twin Overview
// @route   GET /api/finance/twin/overview
// @access  Private
const getOverview = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    
    expenses.forEach(e => {
      if (e._id === 'Income') monthlyIncome = e.total;
      if (e._id === 'Expense') monthlyExpenses = e.total;
    });

    const currentSavings = Math.max(0, monthlyIncome - monthlyExpenses) || 25000;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(2) : 0;

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

// @desc    Goal Forecast
// @route   POST /api/finance/twin/goal
// @access  Private
const forecastGoal = async (req, res) => {
  try {
    const { title, targetAmount, optimizedDailySavingsAddition } = req.body;
    const currentSavings = await getCurrentSavings(req.user.id);

    if (currentSavings >= targetAmount) {
      return res.status(200).json({ estimatedCompletionDays: 0, optimizedCompletionDays: 0 });
    }

    // Proxy request to calculate. To keep it simple, we do the math here since ML just provides base trends
    // Base savings rate per day = approx 500 (just mock it for now since we don't have accurate daily savings from ML directly)
    const baseDailySavings = 250; 
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
