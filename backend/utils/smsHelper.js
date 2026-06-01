const twilio = require('twilio');
const User = require('../models/User');

/**
 * Sends an SMS to a specific phone number or dynamically looks up user's phone number.
 * Never crashes the main flow; logs error and returns success status.
 */
const sendAutomaticSMS = async ({ userId, phoneNumber, message }) => {
  try {
    let targetPhone = phoneNumber;

    // If userId is provided, lookup the user's phone number
    if (userId && !targetPhone) {
      const user = await User.findById(userId);
      if (user && user.phoneNumber) {
        targetPhone = user.phoneNumber;
      }
    }

    if (!targetPhone) {
      console.log('[smsHelper] No phone number available to send notification.');
      return { success: false, reason: 'No phone number available' };
    }

    // Normalize phone number (default Indian +91 prefix)
    const formattedPhone = targetPhone.startsWith('+') ? targetPhone : `+91${targetPhone}`;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.log('[smsHelper] Twilio keys missing from environment. Skipping notification.');
      return { success: false, reason: 'Twilio keys missing' };
    }

    console.log(`[smsHelper] Triggering AUTOMATIC SMS to ${formattedPhone}...`);
    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedPhone,
    });

    console.log(`[smsHelper] AUTOMATIC SMS sent successfully! SID: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('[smsHelper] Failed to send automatic SMS:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendAutomaticSMS };
