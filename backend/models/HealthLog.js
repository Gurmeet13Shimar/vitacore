const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  workoutMinutes: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  caloriesConsumed: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  waterGlasses: { type: Number, default: 0 },
  mood: { type: String, enum: ['Great', 'Good', 'Neutral', 'Bad', 'Terrible'], default: 'Good' },
}, { timestamps: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
