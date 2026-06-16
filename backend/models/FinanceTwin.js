const mongoose = require('mongoose');

const financeTwinSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  forecastResults: {
    forecast30Days: Number,
    forecast60Days: Number,
    forecast90Days: Number,
    trend: String,
    confidence: Number,
    updatedAt: { type: Date, default: Date.now }
  },
  simulationHistory: [{
    foodReductionPercent: Number,
    shoppingReductionPercent: Number,
    transportReductionPercent: Number,
    incomeIncreaseAmount: Number,
    baseline90DaySavings: Number,
    optimized90DaySavings: Number,
    additionalSavings: Number,
    simulatedAt: { type: Date, default: Date.now }
  }],
  optimizationHistory: [{
    optimizations: [{
      action: String,
      additionalSavings: Number,
      rank: Number
    }],
    generatedAt: { type: Date, default: Date.now }
  }],
  financialGoals: [{
    title: String,
    targetAmount: Number,
    estimatedCompletionDays: Number,
    optimizedCompletionDays: Number,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('FinanceTwin', financeTwinSchema);
