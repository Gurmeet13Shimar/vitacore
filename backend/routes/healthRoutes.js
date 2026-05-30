const express = require('express');
const router = express.Router();
const { getHealthLogs, addHealthLog, getNutritionDetails } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHealthLogs).post(protect, addHealthLog);
router.route('/nutrition').get(protect, getNutritionDetails);

module.exports = router;
