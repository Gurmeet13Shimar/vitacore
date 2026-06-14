const Notification = require('../models/Notification');
const axios = require('axios');
const User = require('../models/User');

// ─── Legacy Novu SMS Config (preserved unchanged) ─────────────────────────────
const NOVU_API_URL = 'https://api.novu.co/v1';
const NOVU_WORKFLOW_ID = 'vitacore-notification';

const getNovuHeaders = () => {
  const key = process.env.NOVU_SECRET_KEY;
  if (!key) throw new Error('NOVU_SECRET_KEY is not set in environment variables');
  return {
    Authorization: `ApiKey ${key}`,
    'Content-Type': 'application/json',
  };
};

const triggerNovuNotification = async (subscriberId, phoneNumber, message) => {
  const response = await axios.post(
    `${NOVU_API_URL}/events/trigger`,
    {
      name: NOVU_WORKFLOW_ID,
      to: { subscriberId, phone: phoneNumber },
      payload: { message },
    },
    { headers: getNovuHeaders() }
  );
  return response.data;
};

const resolveUser = async (req) => {
  let phoneNumber = req.body.phoneNumber || null;
  let subscriberId = 'anonymous';
  let userName = '';

  if (req.user && req.user.id) {
    const user = await User.findById(req.user.id);
    if (user) {
      subscriberId = user._id.toString();
      userName = user.name || '';
      phoneNumber = phoneNumber || user.phoneNumber || null;
    }
  }

  if (phoneNumber && !phoneNumber.startsWith('+')) {
    phoneNumber = `+91${phoneNumber}`;
  }

  return { phoneNumber, subscriberId, userName };
};

// ─── Legacy Novu SMS Controllers (preserved) ─────────────────────────────────

// @route POST /api/notifications/send-sms
const sendSMS = async (req, res) => {
  const { message } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);
  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone number and message are required.' });
  }
  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    res.status(200).json({ success: true, message: 'SMS sent successfully!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
};

// @route POST /api/notifications/test
const sendTestNotification = async (req, res) => {
  const { phoneNumber, subscriberId } = await resolveUser(req);
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }
  const message = '✅ VitaCore Alert: Your notification setup is working perfectly! — VitaCore';
  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    res.status(200).json({ success: true, message: 'Test notification sent!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
};

// @route POST /api/notifications/health-reminder
const sendHealthReminder = async (req, res) => {
  const { sleepHours, waterGlasses, caloriesConsumed } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }
  const alerts = [];
  if (sleepHours && sleepHours < 6) alerts.push(`😴 Only ${sleepHours}h sleep!`);
  if (waterGlasses && waterGlasses < 6) alerts.push(`💧 Only ${waterGlasses} glasses of water!`);
  if (caloriesConsumed && caloriesConsumed > 2800) alerts.push(`🔥 High calorie day: ${caloriesConsumed} kcal!`);
  if (alerts.length === 0) {
    return res.status(200).json({ success: true, message: 'All health metrics look good.' });
  }
  const message = `⚡ VitaCore Health Alert:\n${alerts.join('\n')}\n\nKeep pushing! 💪`;
  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    res.status(200).json({ success: true, message: 'Health reminder sent!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
};

// @route POST /api/notifications/streak-reminder
const sendStreakReminder = async (req, res) => {
  const { platform, streakDays } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);
  if (!phoneNumber || !platform) {
    return res.status(400).json({ error: 'Phone number and platform are required.' });
  }
  const message = streakDays > 0
    ? `🔥 VitaCore: You're on a ${streakDays}-day streak on ${platform}! Keep it going! 💻`
    : `📚 VitaCore Reminder: Don't forget to practice on ${platform} today! 🎯`;
  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    res.status(200).json({ success: true, message: 'Streak reminder sent!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
};

// @route POST /api/notifications/finance-alert
const sendFinanceAlert = async (req, res) => {
  const { totalExpenses, budget } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }
  const message = totalExpenses > budget
    ? `💸 VitaCore: Budget exceeded! Spent ₹${totalExpenses} vs ₹${budget}. Time to cut back! 📉`
    : `✅ VitaCore: Great job! Within budget. Spent ₹${totalExpenses} of ₹${budget}. 💰`;
  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    res.status(200).json({ success: true, message: 'Finance alert sent!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
};

// ─── New In-App Notification REST Controllers ─────────────────────────────────

// @desc    Get notifications (paginated, filterable)
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { category, read, search, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user.id };

    if (category && category !== 'all') query.category = category;
    if (read !== undefined && read !== '') query.read = read === 'true';
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { message: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments(query),
    ]);

    res.status(200).json({
      notifications,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('[Notifications] getNotifications error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false,
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );
    res.status(200).json({ modified: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ id: req.params.id, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  // Legacy SMS
  sendSMS,
  sendTestNotification,
  sendHealthReminder,
  sendStreakReminder,
  sendFinanceAlert,
  // New in-app REST
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
