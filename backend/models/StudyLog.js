const mongoose = require('mongoose');

const studyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  topic: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('StudyLog', studyLogSchema);
