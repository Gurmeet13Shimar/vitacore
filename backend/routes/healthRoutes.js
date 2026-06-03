const express = require('express');
const router = express.Router();
const { getHealthLogs, addHealthLog, getNutritionDetails, getFitnessPlan, getExerciseGif } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHealthLogs).post(protect, addHealthLog);
router.route('/nutrition').get(protect, getNutritionDetails);
router.route('/fitness-plan').get(protect, getFitnessPlan);
router.route('/exercise-gif/:exerciseId').get(getExerciseGif);

module.exports = router;
