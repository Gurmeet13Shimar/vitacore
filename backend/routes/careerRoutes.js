const express = require('express');
const router = express.Router();
const { getStudyLogs, addStudyLog, getLeetCodeStats } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStudyLogs).post(protect, addStudyLog);
router.route('/leetcode/:username').get(protect, getLeetCodeStats);

module.exports = router;
