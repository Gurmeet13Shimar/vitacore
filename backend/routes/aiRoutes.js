const express = require('express');
const router = express.Router();
const { getRecommendations, simulateScenario } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getRecommendations);
router.post('/simulate', protect, simulateScenario);

module.exports = router;
