const axios = require('axios');
const HealthLog = require('../models/HealthLog');
const Expense = require('../models/Expense');
const StudyLog = require('../models/StudyLog');
const User = require('../models/User');
const AILog = require('../models/AILog');

// ── Model fallback chain ───────────────────────────────────────────────────────
const MODELS_TO_TRY = [
  'google/gemini-2.5-flash',
  'meta-llama/llama-3-8b-instruct:free',
  'openai/gpt-3.5-turbo',
];

/**
 * Fetch latest user data from MongoDB and build a safe context object.
 * This replaces the old pattern of trusting localStorage data from the client.
 */
const buildUserContext = async (userId) => {
  // Run all DB queries in parallel for speed
  const [user, latestHealth, recentExpenses, recentStudy] = await Promise.all([
    User.findById(userId).select('name email income').lean(),
    HealthLog.findOne({ user: userId }).sort({ date: -1 }).lean(),
    Expense.find({ user: userId }).sort({ date: -1 }).limit(20).lean(),
    StudyLog.find({ user: userId }).sort({ date: -1 }).limit(10).lean(),
  ]);

  // --- Finance summary from real DB records ---
  const incomeRecords = recentExpenses.filter((e) => e.type === 'Income');
  const expenseRecords = recentExpenses.filter((e) => e.type === 'Expense');
  const totalIncome = incomeRecords.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenseRecords.reduce((sum, e) => sum + e.amount, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  // --- Career summary from study logs ---
  const totalStudyMinutes = recentStudy.reduce((sum, s) => sum + s.durationMinutes, 0);
  const recentTopics = [...new Set(recentStudy.map((s) => s.topic))].slice(0, 5);

  return {
    user: {
      name: user?.name || 'User',
    },
    health: latestHealth
      ? {
          sleepHours: latestHealth.sleepHours,
          waterGlasses: latestHealth.waterGlasses,
          caloriesConsumed: latestHealth.caloriesConsumed,
          workoutMinutes: latestHealth.workoutMinutes,
          mood: latestHealth.mood,
          heartRate: latestHealth.heartRate,
          stressLevel: latestHealth.stressLevel,
          riskLevel: latestHealth.riskLevel,
          prediction: latestHealth.prediction,
          logDate: latestHealth.date,
        }
      : null,
    finance: {
      monthlyIncome: totalIncome || user?.income || 0,
      monthlyExpenses: totalExpenses,
      savings,
      savingsRate,
      recentTransactionCount: recentExpenses.length,
    },
    career: {
      totalStudyMinutesRecent: totalStudyMinutes,
      recentTopics,
      sessionCount: recentStudy.length,
    },
  };
};

/**
 * Call OpenRouter with a fallback chain.
 * Returns { text, modelUsed, status }.
 */
const callOpenRouter = async (prompt, apiKey) => {
  let lastError = null;

  for (const model of MODELS_TO_TRY) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const text = response.data?.choices?.[0]?.message?.content;
      if (text) {
        return { text, modelUsed: model, status: 'success' };
      }
    } catch (err) {
      console.warn(`[AI] Model ${model} failed:`, err.response?.data || err.message);
      lastError = err;
    }
  }

  console.error('[AI] All models failed. Last error:', lastError?.response?.data || lastError);
  return { text: null, modelUsed: 'none', status: 'failed' };
};

// ── Controller: getRecommendations ─────────────────────────────────────────────
// @route   POST /api/ai/recommend
// @access  Private (protect + aiRateLimiter)
const getRecommendations = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;

  try {
    const { domain = 'General', message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured on this server.',
      });
    }

    // Fetch real context from DB — no client data is trusted
    const context = await buildUserContext(userId);

    const prompt = `
You are VitaCore AI, a personalized life assistant.

User Question:
${message}

Domain:
${domain}

User Context (sourced from verified database records):
${JSON.stringify(context, null, 2)}

Instructions:
1. First analyze the user's context.
2. Answer the user's specific question directly.
3. Use the provided context only when relevant.
4. Give practical, actionable recommendations.
5. Avoid generic motivational filler.
6. Keep the response between 100-200 words.
7. Mention risks, opportunities, and next actions when applicable.

Examples:
- If the question is about sleep, focus on health metrics.
- If the question is about money, focus on finance metrics.
- If the question is about learning or jobs, focus on career metrics.
- If the question is unrelated to the context, answer normally but briefly.

Response:
`.trim();

    const { text, modelUsed, status } = await callOpenRouter(prompt, API_KEY);

    const durationMs = Date.now() - startTime;

    // Fire-and-forget audit log — never let this crash the response
    AILog.create({
      userId,
      endpoint: '/recommend',
      domain,
      promptLength: prompt.length,
      modelUsed,
      responseStatus: status,
      durationMs,
    }).catch((logErr) => console.warn('[AILog] Failed to write audit log:', logErr.message));

    if (status === 'success') {
      return res.status(200).json({ success: true, recommendation: text });
    }

    return res.status(503).json({
      success: false,
      message: 'AI service temporarily unavailable. Please try again shortly.',
    });

  } catch (error) {
    console.error('[AI] getRecommendations error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};

// ── Controller: simulateScenario ───────────────────────────────────────────────
// @route   POST /api/ai/simulate
// @access  Private (protect + aiRateLimiter)
const simulateScenario = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;

  try {
    const { scenario } = req.body;

    if (!scenario || !scenario.trim()) {
      return res.status(400).json({ success: false, message: 'Scenario is required.' });
    }

    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured on this server.',
      });
    }

    const prompt = `
You are VitaCore Neural AI Simulation Engine.

Scenario:
"${scenario}"

Instructions:
- Predict realistic outcomes
- Mention benefits and risks
- Mention possible timelines if relevant
- Sound futuristic and analytical
- Keep response concise but smart
`.trim();

    const { text, modelUsed, status } = await callOpenRouter(prompt, API_KEY);

    const durationMs = Date.now() - startTime;

    AILog.create({
      userId,
      endpoint: '/simulate',
      domain: 'Simulator',
      promptLength: prompt.length,
      modelUsed,
      responseStatus: status,
      durationMs,
    }).catch((logErr) => console.warn('[AILog] Failed to write audit log:', logErr.message));

    if (status === 'success') {
      return res.status(200).json({ success: true, analysis: text });
    }

    return res.status(503).json({
      success: false,
      message: 'Simulation currently unavailable. Please try again shortly.',
    });

  } catch (error) {
    console.error('[AI] simulateScenario error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};

module.exports = { getRecommendations, simulateScenario };