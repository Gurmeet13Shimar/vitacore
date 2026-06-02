const axios = require('axios');
const User = require('../models/User');

const NOVU_API_URL = 'https://api.novu.co/v1';
const NOVU_WORKFLOW_ID = 'vitacore-notification';

/**
 * Sends a notification via Novu to a specific phone number or looks up user's phone number.
 * Never crashes the main flow — logs error and returns a success status object.
 *
 * @param {Object} options
 * @param {string} [options.userId]       - MongoDB user _id (used to look up phone if not passed)
 * @param {string} [options.phoneNumber]  - E.164 phone number (takes priority over userId lookup)
 * @param {string}  options.message       - The message body to send
 */
const sendAutomaticSMS = async ({ userId, phoneNumber, message }) => {
  try {
    let targetPhone = phoneNumber;
    let subscriberId = userId || 'anonymous';

    // Look up user's phone if not directly provided
    if (userId && !targetPhone) {
      const user = await User.findById(userId);
      if (user && user.phoneNumber) {
        targetPhone = user.phoneNumber;
      }
    }

    if (!targetPhone) {
      console.log('[smsHelper] No phone number available — skipping notification.');
      return { success: false, reason: 'No phone number available' };
    }

    // Normalise to E.164 (default +91 India if no country code)
    const formattedPhone = targetPhone.startsWith('+') ? targetPhone : `+91${targetPhone}`;

    const novuKey = process.env.NOVU_SECRET_KEY;
    if (!novuKey) {
      console.log('[smsHelper] NOVU_SECRET_KEY missing from environment — skipping notification.');
      return { success: false, reason: 'NOVU_SECRET_KEY missing' };
    }

    console.log(`[smsHelper] Triggering Novu notification to ${formattedPhone}...`);

    const response = await axios.post(
      `${NOVU_API_URL}/events/trigger`,
      {
        name: NOVU_WORKFLOW_ID,
        to: {
          subscriberId,
          phone: formattedPhone,
        },
        payload: { message },
      },
      {
        headers: {
          Authorization: `ApiKey ${novuKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[smsHelper] Novu notification triggered! transactionId: ${response.data?.data?.transactionId}`);
    return { success: true, data: response.data };
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('[smsHelper] Failed to send Novu notification:', errMsg);
    return { success: false, error: errMsg };
  }
};

module.exports = { sendAutomaticSMS };
