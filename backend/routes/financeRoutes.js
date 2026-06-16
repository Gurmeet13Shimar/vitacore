const express = require('express');
const router = express.Router();
const { getExpenses, addExpense } = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');
const { getOverview, getForecast, simulateFinance, getOptimizations, forecastGoal } = require('../controllers/financeTwinController');

router.route('/').get(protect, getExpenses).post(protect, addExpense);

// Finance Twin Routes
router.route('/twin/overview').get(protect, getOverview);
router.route('/twin/forecast').post(protect, getForecast);
router.route('/twin/simulate').post(protect, simulateFinance);
router.route('/twin/optimize').post(protect, getOptimizations);
router.route('/twin/goal').post(protect, forecastGoal);

module.exports = router;
