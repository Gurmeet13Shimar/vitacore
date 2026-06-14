const Expense = require('../models/Expense');
const { sendAutomaticSMS } = require('../utils/smsHelper');
const { createNotification } = require('../services/notificationService');
const mongoose = require('mongoose');

// @desc    Get user expenses
// @route   GET /api/finance
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add an expense or income
// @route   POST /api/finance
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { amount, category, description, type, date } = req.body;
    if (!amount || !category) {
      return res.status(400).json({ message: 'Please provide amount and category' });
    }
    const expense = await Expense.create({
      user: req.user.id,
      date: date || Date.now(),
      amount,
      category,
      description,
      type
    });

    // --- Automatic Budget & Expense Warning System ---
    if (expense.type === 'Expense') {
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyExpenses = await Expense.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.user.id),
              type: 'Expense',
              date: { $gte: startOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const totalSpent = (monthlyExpenses[0]?.total || 0);
        const monthlyBudget = 15000; // set standard threshold warning limit

        if (totalSpent > monthlyBudget) {
          const budgetExceededMsg = `You have exceeded your monthly budget! Total spent: ₹${totalSpent.toLocaleString()} (Limit: ₹${monthlyBudget.toLocaleString()}). Try to minimize extra costs.`;
          const smsMsg = `💸 VitaCore Budget Alert: You have exceeded your monthly budget! Total spent: ₹${totalSpent.toLocaleString()} (Limit: ₹${monthlyBudget.toLocaleString()}). Try to minimize extra costs. 📉`;
          
          // In-App Notification
          createNotification(
            req.user.id,
            '💸 Budget Exceeded',
            budgetExceededMsg,
            'finance',
            'critical'
          );

          // SMS Alert
          sendAutomaticSMS({ userId: req.user.id, message: smsMsg });
        } else if (expense.amount >= 3000) {
          const highExpenseMsg = `You logged a high individual expense of ₹${expense.amount.toLocaleString()} for "${expense.category}" (${expense.description || 'No description'}).`;
          const smsMsg = `⚠️ VitaCore Finance: You logged a high individual expense of ₹${expense.amount.toLocaleString()} for "${expense.category}" (${expense.description || 'No description'}).`;
          
          // In-App Notification
          createNotification(
            req.user.id,
            '⚠️ High Expense Warning',
            highExpenseMsg,
            'finance',
            'high'
          );

          // SMS Alert
          sendAutomaticSMS({ userId: req.user.id, message: smsMsg });
        }
      } catch (aggErr) {
        console.error('[FinanceAlert] Aggregation error:', aggErr.message);
      }
    }

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getExpenses, addExpense };
