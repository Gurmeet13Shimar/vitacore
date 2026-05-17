const express = require('express');
const router = express.Router();
const { getRecommendations, simulateScenario } = require('../controllers/aiController');

// Temporarily removed protect middleware for testing
router.post('/recommend', getRecommendations);
router.post('/simulate', simulateScenario);

module.exports = router;
