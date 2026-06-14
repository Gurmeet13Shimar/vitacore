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
  // Sleep Health & Lifestyle features
  age: { type: Number, default: 25 },
  qualityOfSleep: { type: Number, default: 6 },
  stressLevel: { type: Number, default: 5 },
  heartRate: { type: Number, default: 72 },
  dailySteps: { type: Number, default: 5000 },
  // ML Prediction Results
  prediction: { type: String, default: 'None' },
  confidence: { type: Number, default: 0 },
  riskLevel: { type: String, default: 'Low' },
}, { timestamps: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
