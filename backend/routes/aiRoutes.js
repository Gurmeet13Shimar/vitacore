const express = require('express');
const router = express.Router();
const { getRecommendations, simulateScenario } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { aiRateLimiter } = require('../middleware/aiRateLimiter');

// Both routes: authenticate first, then rate-limit, then handle
router.post('/recommend', protect, aiRateLimiter, getRecommendations);
router.post('/simulate', protect, aiRateLimiter, simulateScenario);

module.exports = router;
