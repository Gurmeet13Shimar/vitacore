const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  // Legacy Novu SMS routes
  sendSMS,
  sendTestNotification,
  sendHealthReminder,
  sendStreakReminder,
  sendFinanceAlert,
  // New in-app notification REST routes
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

// ── Legacy Novu SMS endpoints (preserved unchanged) ───────────────────────────
router.post('/send-sms', protect, sendSMS);
router.post('/test', protect, sendTestNotification);
router.post('/health-reminder', protect, sendHealthReminder);
router.post('/streak-reminder', protect, sendStreakReminder);
router.post('/finance-alert', protect, sendFinanceAlert);

// ── New in-app notification REST endpoints ────────────────────────────────────
// IMPORTANT: /read-all and /unread-count must be defined BEFORE /:id routes
// to prevent Express from treating 'read-all' as an :id parameter.
router.get('/unread-count', protect, getUnreadCount);
router.patch('/read-all', protect, markAllAsRead);
router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
