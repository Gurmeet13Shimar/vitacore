const express = require('express');
const router = express.Router();
const { getStudyLogs, addStudyLog } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStudyLogs).post(protect, addStudyLog);

module.exports = router;
