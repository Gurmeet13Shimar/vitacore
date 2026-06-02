const axios = require('axios');
const User = require('../models/User');

// ─── Novu Config ────────────────────────────────────────────────────────────
const NOVU_API_URL = 'https://api.novu.co/v1';

// Single workflow ID — create this once in your Novu dashboard
// (see README comment at the bottom of this file)
const NOVU_WORKFLOW_ID = 'vitacore-notification';

const getNovuHeaders = () => {
  const key = process.env.NOVU_SECRET_KEY;
  if (!key) throw new Error('NOVU_SECRET_KEY is not set in environment variables');
  return {
    Authorization: `ApiKey ${key}`,
    'Content-Type': 'application/json',
  };
};

// ─── Core Helpers ────────────────────────────────────────────────────────────

/**
 * Trigger a Novu workflow for a given subscriber.
 * Novu auto-creates the subscriber if it doesn't exist yet.
 */
const triggerNovuNotification = async (subscriberId, phoneNumber, message) => {
  const response = await axios.post(
    `${NOVU_API_URL}/events/trigger`,
    {
      name: NOVU_WORKFLOW_ID,
      to: {
        subscriberId,   // unique per user — we use MongoDB _id
        phone: phoneNumber,
      },
      payload: { message },
    },
    { headers: getNovuHeaders() }
  );
  return response.data;
};

/**
 * Resolve the authenticated user's phone number and subscriber ID.
 * Falls back to the phone number in req.body if the user hasn't saved one.
 */
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

  // Ensure E.164 format (default +91 for India if no country code)
  if (phoneNumber && !phoneNumber.startsWith('+')) {
    phoneNumber = `+91${phoneNumber}`;
  }

  return { phoneNumber, subscriberId, userName };
};

// ─── Controllers ─────────────────────────────────────────────────────────────

// @desc    Send a generic SMS notification
// @route   POST /api/notifications/send-sms
// @access  Private
const sendSMS = async (req, res) => {
  const { message } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone number and message are required.' });
  }

  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    console.log(`[Novu] SMS triggered for subscriber ${subscriberId}`);
    res.status(200).json({ success: true, message: 'SMS sent successfully!', data: result });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('[Novu] Error sending SMS:', errMsg);
    res.status(500).json({ success: false, error: errMsg });
  }
};

// @desc    Send a test/health-check notification
// @route   POST /api/notifications/test
// @access  Private
const sendTestNotification = async (req, res) => {
  const { phoneNumber, subscriberId } = await resolveUser(req);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const message =
    '✅ VitaCore Alert: Your notification setup is working perfectly! You will now receive important reminders here. — VitaCore';

  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    console.log(`[Novu] Test notification triggered for subscriber ${subscriberId}`);
    res.status(200).json({ success: true, message: 'Test notification sent!', data: result });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('[Novu] Error sending test notification:', errMsg);
    res.status(500).json({ success: false, error: errMsg });
  }
};

// @desc    Send a health goal reminder
// @route   POST /api/notifications/health-reminder
// @access  Private
const sendHealthReminder = async (req, res) => {
  const { sleepHours, waterGlasses, caloriesConsumed } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const alerts = [];
  if (sleepHours && sleepHours < 6)
    alerts.push(`😴 Only ${sleepHours}h sleep! Try to get 7-8 hours.`);
  if (waterGlasses && waterGlasses < 6)
    alerts.push(`💧 Only ${waterGlasses} glasses of water! Drink more.`);
  if (caloriesConsumed && caloriesConsumed > 2800)
    alerts.push(`🔥 High calorie day: ${caloriesConsumed} kcal! Stay mindful.`);

  if (alerts.length === 0) {
    return res
      .status(200)
      .json({ success: true, message: 'All health metrics look good — no alerts needed.' });
  }

  const message = `⚡ VitaCore Health Alert:\n${alerts.join('\n')}\n\nKeep pushing! 💪`;

  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    console.log(`[Novu] Health reminder triggered for subscriber ${subscriberId}`);
    res.status(200).json({ success: true, message: 'Health reminder sent!', data: result });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('[Novu] Error sending health reminder:', errMsg);
    res.status(500).json({ success: false, error: errMsg });
  }
};

// @desc    Send a study streak reminder
// @route   POST /api/notifications/streak-reminder
// @access  Private
const sendStreakReminder = async (req, res) => {
  const { platform, streakDays } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);

  if (!phoneNumber || !platform) {
    return res.status(400).json({ error: 'Phone number and platform are required.' });
  }

  const message =
    streakDays > 0
      ? `🔥 VitaCore: You're on a ${streakDays}-day streak on ${platform}! Keep it going today! 💻`
      : `📚 VitaCore Reminder: Don't forget to practice on ${platform} today to build your streak! 🎯`;

  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    console.log(`[Novu] Streak reminder triggered for subscriber ${subscriberId}`);
    res.status(200).json({ success: true, message: 'Streak reminder sent!', data: result });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('[Novu] Error sending streak reminder:', errMsg);
    res.status(500).json({ success: false, error: errMsg });
  }
};

// @desc    Send a finance/savings alert
// @route   POST /api/notifications/finance-alert
// @access  Private
const sendFinanceAlert = async (req, res) => {
  const { totalExpenses, budget } = req.body;
  const { phoneNumber, subscriberId } = await resolveUser(req);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const message =
    totalExpenses > budget
      ? `💸 VitaCore Finance Alert: You've exceeded your budget! Spent ₹${totalExpenses} vs budget ₹${budget}. Time to cut back! 📉`
      : `✅ VitaCore Finance: Great job! You're within budget. Spent ₹${totalExpenses} of ₹${budget}. Keep it up! 💰`;

  try {
    const result = await triggerNovuNotification(subscriberId, phoneNumber, message);
    console.log(`[Novu] Finance alert triggered for subscriber ${subscriberId}`);
    res.status(200).json({ success: true, message: 'Finance alert sent!', data: result });
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('[Novu] Error sending finance alert:', errMsg);
    res.status(500).json({ success: false, error: errMsg });
  }
};

module.exports = {
  sendSMS,
  sendTestNotification,
  sendHealthReminder,
  sendStreakReminder,
  sendFinanceAlert,
};

/*
 * ─── NOVU DASHBOARD SETUP (one-time) ─────────────────────────────────────────
 *
 * 1. Go to https://dashboard.novu.co → Workflows → Create Workflow
 * 2. Name it exactly: "vitacore-notification"  (this is the workflow ID)
 * 3. Add an SMS step → set Body to:  {{message}}
 * 4. Go to Settings → Integrations → add an SMS provider
 *    (Twilio, Vonage, AWS SNS, etc.) and connect your credentials there.
 *    Novu will route SMS through whichever provider you connect.
 * 5. That's it! All five notification endpoints will now work through Novu.
 */
