const Expense = require('../models/Expense');

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
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getExpenses, addExpense };
