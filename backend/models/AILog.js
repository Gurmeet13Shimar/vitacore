const mongoose = require('mongoose');

/**
 * AILog — persists every AI API call for audit, debugging, and abuse monitoring.
 * Written after every request to /api/ai/recommend and /api/ai/simulate.
 */
const aiLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    endpoint: {
      type: String,
      enum: ['/recommend', '/simulate'],
      required: true,
    },
    domain: {
      type: String,
      default: 'General',
    },
    promptLength: {
      type: Number,
      default: 0,
    },
    modelUsed: {
      type: String,
      default: 'unknown',
    },
    responseStatus: {
      type: String,
      enum: ['success', 'failed', 'fallback'],
      default: 'success',
    },
    durationMs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for fast per-user queries and time-range analysis
aiLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AILog', aiLogSchema);
