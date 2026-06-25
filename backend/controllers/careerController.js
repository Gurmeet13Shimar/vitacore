const StudyLog = require('../models/StudyLog');
const { sendAutomaticSMS } = require('../utils/smsHelper');
const { createNotification } = require('../services/notificationService');
const axios = require('axios');

// @desc    Get user study logs
// @route   GET /api/career
// @access  Private
const getStudyLogs = async (req, res) => {
  try {
    const logs = await StudyLog.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a study log
// @route   POST /api/career
// @access  Private
const addStudyLog = async (req, res) => {
  try {
    const { topic, durationMinutes, notes, date } = req.body;
    if (!topic || !durationMinutes) {
      return res.status(400).json({ message: 'Please provide topic and duration' });
    }
    const log = await StudyLog.create({
      user: req.user.id,
      date: date || Date.now(),
      topic,
      durationMinutes,
      notes
    });

    // --- Automatic Deep Focus Celebration Alert ---
    if (durationMinutes >= 120) {
      const celebrationMsg = `🚀 VitaCore Focus Celebration: Incredible work! You've successfully finished a deep-focus session of ${durationMinutes} minutes on "${topic}"! Keep this standard going! 💻🌟`;
      const inAppMsg = `Incredible work! You've successfully finished a deep-focus session of ${durationMinutes} minutes on "${topic}"! Keep this standard going! 💻`;
      
      createNotification(req.user.id, '🚀 Deep Focus Achieved!', inAppMsg, 'career', 'high');
      sendAutomaticSMS({ userId: req.user.id, message: celebrationMsg });
    } else if (durationMinutes < 30) {
      const warningMsg = `You logged a study session of only ${durationMinutes} minutes on "${topic}". Try to block out at least 30-45 minutes next time for deeper learning.`;
      createNotification(req.user.id, '📚 Short Study Session', warningMsg, 'career', 'medium');
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch real LeetCode stats via official GraphQL
// @route   GET /api/career/leetcode/:username
// @access  Private
const getLeetCodeStats = async (req, res) => {
  const { username } = req.params;
  try {
    const query = `
      query userProfileCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.errors) {
      return res.status(400).json({ message: response.data.errors[0].message });
    }

    const data = response.data.data;
    if (!data.matchedUser) {
      return res.status(404).json({ message: 'User not found on LeetCode' });
    }

    const calendar = data.matchedUser.userCalendar || {};
    const submitStats = data.matchedUser.submitStats || {};
    
    res.status(200).json({
      username,
      streak: calendar.streak || 0,
      totalActiveDays: calendar.totalActiveDays || 0,
      activeYears: calendar.activeYears || [],
      submitStats: submitStats.acSubmissionNum || []
    });

  } catch (error) {
    console.error("LeetCode fetch error:", error.message);
    res.status(500).json({ message: 'Error fetching LeetCode data' });
  }
};

module.exports = { getStudyLogs, addStudyLog, getLeetCodeStats };

