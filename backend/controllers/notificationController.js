const twilio = require('twilio');
const User = require('../models/User');

// Initialize Twilio client
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }
  return twilio(accountSid, authToken);
};

// Helper to resolve phone number from request body or authenticated user
const resolvePhoneNumber = async (req) => {
  if (req.body.phoneNumber) {
    return req.body.phoneNumber;
  }
  if (req.user && req.user.id) {
    const user = await User.findById(req.user.id);
    if (user && user.phoneNumber) {
      return user.phoneNumber;
    }
  }
  return null;
};

// @desc    Send an SMS notification to a phone number
// @route   POST /api/notifications/send-sms
// @access  Private
const sendSMS = async (req, res) => {
  const { message } = req.body;
  const phoneNumber = await resolvePhoneNumber(req);

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone number and message are required.' });
  }

  // Normalize phone: ensure it has a country code
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  try {
    const client = getTwilioClient();
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`[Twilio] SMS sent to ${formattedPhone}, SID: ${result.sid}`);
    res.status(200).json({ success: true, message: 'SMS sent successfully!', sid: result.sid });
  } catch (error) {
    console.error('[Twilio] Error sending SMS:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send a test/health check notification
// @route   POST /api/notifications/test
// @access  Private
const sendTestNotification = async (req, res) => {
  const phoneNumber = await resolvePhoneNumber(req);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  try {
    const client = getTwilioClient();
    const result = await client.messages.create({
      body: `✅ VitaCore Alert: Your notification setup is working perfectly! You will now receive important reminders here. — VitaCore`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`[Twilio] Test SMS sent to ${formattedPhone}, SID: ${result.sid}`);
    res.status(200).json({ success: true, message: 'Test notification sent!', sid: result.sid });
  } catch (error) {
    console.error('[Twilio] Error sending test SMS:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send a health goal reminder
// @route   POST /api/notifications/health-reminder
// @access  Private
const sendHealthReminder = async (req, res) => {
  const { sleepHours, waterGlasses, caloriesConsumed } = req.body;
  const phoneNumber = await resolvePhoneNumber(req);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  const alerts = [];
  if (sleepHours && sleepHours < 6) alerts.push(`😴 Only ${sleepHours}h sleep! Try to get 7-8 hours.`);
  if (waterGlasses && waterGlasses < 6) alerts.push(`💧 Only ${waterGlasses} glasses of water! Drink more.`);
  if (caloriesConsumed && caloriesConsumed > 2800) alerts.push(`🔥 High calorie day: ${caloriesConsumed} kcal! Stay mindful.`);

  if (alerts.length === 0) {
    return res.status(200).json({ success: true, message: 'All health metrics look good — no alerts needed.' });
  }

  const messageBody = `⚡ VitaCore Health Alert:\n${alerts.join('\n')}\n\nKeep pushing! 💪`;

  try {
    const client = getTwilioClient();
    const result = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    res.status(200).json({ success: true, message: 'Health reminder sent!', sid: result.sid });
  } catch (error) {
    console.error('[Twilio] Error sending health reminder:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send a study streak reminder
// @route   POST /api/notifications/streak-reminder
// @access  Private
const sendStreakReminder = async (req, res) => {
  const { platform, streakDays } = req.body;
  const phoneNumber = await resolvePhoneNumber(req);

  if (!phoneNumber || !platform) {
    return res.status(400).json({ error: 'Phone number and platform are required.' });
  }

  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  const messageBody = streakDays > 0
    ? `🔥 VitaCore: You're on a ${streakDays}-day streak on ${platform}! Keep it going today! 💻`
    : `📚 VitaCore Reminder: Don't forget to practice on ${platform} today to build your streak! 🎯`;

  try {
    const client = getTwilioClient();
    const result = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    res.status(200).json({ success: true, message: 'Streak reminder sent!', sid: result.sid });
  } catch (error) {
    console.error('[Twilio] Error sending streak reminder:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send a finance/savings alert
// @route   POST /api/notifications/finance-alert
// @access  Private
const sendFinanceAlert = async (req, res) => {
  const { totalExpenses, budget } = req.body;
  const phoneNumber = await resolvePhoneNumber(req);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  let messageBody = '';
  if (totalExpenses > budget) {
    messageBody = `💸 VitaCore Finance Alert: You've exceeded your budget! Spent ₹${totalExpenses} vs budget ₹${budget}. Time to cut back! 📉`;
  } else {
    messageBody = `✅ VitaCore Finance: Great job! You're within budget. Spent ₹${totalExpenses} of ₹${budget}. Keep it up! 💰`;
  }

  try {
    const client = getTwilioClient();
    const result = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    res.status(200).json({ success: true, message: 'Finance alert sent!', sid: result.sid });
  } catch (error) {
    console.error('[Twilio] Error sending finance alert:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  sendSMS,
  sendTestNotification,
  sendHealthReminder,
  sendStreakReminder,
  sendFinanceAlert,
};

