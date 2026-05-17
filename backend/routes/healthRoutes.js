const express = require('express');
const router = express.Router();
const { getHealthLogs, addHealthLog } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHealthLogs).post(protect, addHealthLog);

module.exports = router;
