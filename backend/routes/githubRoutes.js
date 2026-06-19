const express = require('express');
const router = express.Router();
const { getGithubStats, getLinkedProfile, disconnectGithub } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

// Get linked profile details or disconnect it
router.route('/').get(protect, getLinkedProfile).delete(protect, disconnectGithub);

// Fetch stats for specific username and link it to profile
router.get('/:username', protect, getGithubStats);

module.exports = router;
