const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  domain: { type: String, enum: ['Health', 'Finance', 'Career'], required: true },
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Failed'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
