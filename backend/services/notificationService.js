const Notification = require('../models/Notification');
const User = require('../models/User');
const { getIO } = require('../config/socket');
const { Novu } = require('@novu/node');

let _novu = null;
const getNovu = () => {
  const key = process.env.NOVU_SECRET_KEY;
  if (!key || key === 'your_novu_api_secret_key_here') return null;
  if (!_novu) _novu = new Novu(key);
  return _novu;
};

/**
 * Core notification creator — saves to MongoDB, pushes in real-time via Socket.IO,
 * and triggers Novu for external delivery (Email, SMS, Push).
 * Never throws — all errors are caught and logged so callers never crash.
 *
 * @param {string} userId     - MongoDB user _id string
 * @param {string} title      - Short notification title
 * @param {string} message    - Full notification message
 * @param {string} category   - 'health' | 'finance' | 'career' | 'system'
 * @param {string} priority   - 'low' | 'medium' | 'high' | 'critical'
 * @returns {Promise<Object|null>} Saved notification document, or null on error
 */
const createNotification = async (
  userId,
  title,
  message,
  category = 'system',
  priority = 'medium'
) => {
  try {
    // 1. Persist to MongoDB
    const notification = await Notification.create({
      userId,
      title,
      message,
      category,
      priority,
    });

    // 2. Fetch User to get email for Novu
    const user = await User.findById(userId);

    // 3. Trigger Novu workflow for external emails/push notifications
    const novuClient = getNovu();
    if (user && novuClient && process.env.NOVU_WORKFLOW_ID) {
      try {
        await novuClient.trigger(process.env.NOVU_WORKFLOW_ID, {
          to: {
            subscriberId: userId.toString(),
            email: user.email,
          },
          payload: {
            title,
            message,
            category,
            priority
          }
        });
      } catch (novuErr) {
        console.warn('[NotificationService] Novu trigger failed:', novuErr.message);
      }
    }

    // 4. Push real-time event to user's Socket.IO room for in-app UI
    try {
      const io = getIO();
      io.to(userId.toString()).emit('newNotification', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        category: notification.category,
        priority: notification.priority,
        read: notification.read,
        createdAt: notification.createdAt,
      });
    } catch (socketErr) {
      console.warn('[NotificationService] Socket.IO emit skipped:', socketErr.message);
    }

    console.log(`[NotificationService] Created "${title}" for user ${userId}`);
    return notification;
  } catch (err) {
    console.error('[NotificationService] Failed to create notification:', err.message);
    return null;
  }
};

module.exports = { createNotification };
