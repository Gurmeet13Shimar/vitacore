const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendSMS,
  sendTestNotification,
  sendHealthReminder,
  sendStreakReminder,
  sendFinanceAlert,
} = require('../controllers/notificationController');

// POST /api/notifications/send-sms      — generic custom message
router.post('/send-sms', protect, sendSMS);

// POST /api/notifications/test          — test if phone number works
router.post('/test', protect, sendTestNotification);

// POST /api/notifications/health-reminder
router.post('/health-reminder', protect, sendHealthReminder);

// POST /api/notifications/streak-reminder
router.post('/streak-reminder', protect, sendStreakReminder);

// POST /api/notifications/finance-alert
router.post('/finance-alert', protect, sendFinanceAlert);

module.exports = router;
