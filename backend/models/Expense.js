const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Income', 'Expense'], default: 'Expense' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
