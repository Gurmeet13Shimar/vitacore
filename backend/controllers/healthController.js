const HealthLog = require('../models/HealthLog');
const axios = require('axios');
const { sendAutomaticSMS } = require('../utils/smsHelper');
const { createNotification } = require('../services/notificationService');

// @desc    Get user health logs
// @route   GET /api/health
// @access  Private
const getHealthLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a health log
// @route   POST /api/health
// @access  Private
const addHealthLog = async (req, res) => {
  try {
    const { 
      workoutMinutes, 
      caloriesBurned, 
      caloriesConsumed, 
      sleepHours, 
      waterGlasses, 
      mood, 
      date,
      age,
      qualityOfSleep,
      stressLevel,
      heartRate,
      dailySteps
    } = req.body;

    // Call FastAPI to predict health risk
    let prediction = 'None';
    let confidence = 1.0;
    let riskLevel = 'Low';

    try {
      const mlResponse = await axios.post('http://127.0.0.1:8000/predict-health-risk', {
        age: Number(age) || 25,
        sleepDuration: Number(sleepHours) || 7.0,
        qualityOfSleep: Number(qualityOfSleep) || 6,
        physicalActivity: Number(workoutMinutes) || 30,
        stressLevel: Number(stressLevel) || 5,
        heartRate: Number(heartRate) || 72,
        dailySteps: Number(dailySteps) || 5000
      }, { timeout: 4000 });

      if (mlResponse.data) {
        prediction = mlResponse.data.prediction;
        confidence = mlResponse.data.confidence;
        riskLevel = mlResponse.data.riskLevel;
      }
    } catch (mlErr) {
      console.warn('[HealthController] ML Sleep prediction service failed, falling back:', mlErr.message);
    }

    const log = await HealthLog.create({
      user: req.user.id,
      date: date || Date.now(),
      workoutMinutes,
      caloriesBurned,
      caloriesConsumed,
      sleepHours,
      waterGlasses,
      mood,
      age: Number(age) || 25,
      qualityOfSleep: Number(qualityOfSleep) || 6,
      stressLevel: Number(stressLevel) || 5,
      heartRate: Number(heartRate) || 72,
      dailySteps: Number(dailySteps) || 5000,
      prediction,
      confidence,
      riskLevel
    });

    const userId = req.user.id;

    // ── In-App Notifications ────────────────────────────────────────────────
    if (sleepHours && sleepHours < 6) {
      createNotification(
        userId,
        '😴 Low Sleep Alert',
        `You only slept ${sleepHours} hours last night. Chronic sleep deprivation affects focus, mood, and physical recovery. Aim for 7-8 hours tonight!`,
        'health',
        'high'
      );
    }

    if (waterGlasses && waterGlasses < 6) {
      createNotification(
        userId,
        '💧 Water Goal Missed',
        `You only had ${waterGlasses} glasses of water today. Staying hydrated improves energy, skin, and cognitive performance. Try to hit 8+ glasses tomorrow!`,
        'health',
        'medium'
      );
    }

    if (workoutMinutes !== undefined && workoutMinutes === 0) {
      createNotification(
        userId,
        '🏃 Workout Missed',
        `No workout logged today. Even a 20-minute walk counts! Consistency is the key to long-term health. Get back on track tomorrow! 💪`,
        'health',
        'medium'
      );
    }

    // ── Legacy SMS Alerts (preserved, run in parallel) ──────────────────────
    const smsAlerts = [];
    if (sleepHours && sleepHours < 6) smsAlerts.push(`😴 Only ${sleepHours} hours of sleep today!`);
    if (waterGlasses && waterGlasses < 6) smsAlerts.push(`💧 Hydration alert: Only ${waterGlasses} glasses of water.`);
    if (caloriesConsumed && caloriesConsumed > 2800) smsAlerts.push(`🔥 Nutrition alert: High calorie day at ${caloriesConsumed} kcal!`);

    if (smsAlerts.length > 0) {
      const alertMsg = `⚠️ VitaCore Health Alert:\n${smsAlerts.join('\n')}\n\nTake care! 💪`;
      sendAutomaticSMS({ userId, message: alertMsg });
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Local food database — used as fallback when API key is unavailable
const LOCAL_FOODS = [
  { name: 'oatmeal',          calories: 150, protein_g: 5,   fat_total_g: 3,   carbohydrates_total_g: 27  },
  { name: 'banana',           calories: 89,  protein_g: 1.1, fat_total_g: 0.3, carbohydrates_total_g: 23  },
  { name: 'apple',            calories: 95,  protein_g: 0.5, fat_total_g: 0.3, carbohydrates_total_g: 25  },
  { name: 'milk',             calories: 149, protein_g: 8,   fat_total_g: 8,   carbohydrates_total_g: 12  },
  { name: 'egg',              calories: 78,  protein_g: 6,   fat_total_g: 5,   carbohydrates_total_g: 0.6 },
  { name: 'rice',             calories: 206, protein_g: 4.3, fat_total_g: 0.4, carbohydrates_total_g: 45  },
  { name: 'bread',            calories: 79,  protein_g: 2.7, fat_total_g: 1,   carbohydrates_total_g: 15  },
  { name: 'chicken breast',   calories: 165, protein_g: 31,  fat_total_g: 3.6, carbohydrates_total_g: 0   },
  { name: 'dal',              calories: 116, protein_g: 9,   fat_total_g: 0.4, carbohydrates_total_g: 20  },
  { name: 'roti',             calories: 71,  protein_g: 2.5, fat_total_g: 0.4, carbohydrates_total_g: 15  },
  { name: 'chapati',          calories: 71,  protein_g: 2.5, fat_total_g: 0.4, carbohydrates_total_g: 15  },
  { name: 'paneer',           calories: 265, protein_g: 18,  fat_total_g: 20,  carbohydrates_total_g: 3   },
  { name: 'yogurt',           calories: 100, protein_g: 17,  fat_total_g: 0.7, carbohydrates_total_g: 6   },
  { name: 'orange',           calories: 62,  protein_g: 1.2, fat_total_g: 0.2, carbohydrates_total_g: 15  },
  { name: 'mango',            calories: 99,  protein_g: 1.4, fat_total_g: 0.6, carbohydrates_total_g: 25  },
  { name: 'potato',           calories: 77,  protein_g: 2,   fat_total_g: 0.1, carbohydrates_total_g: 17  },
  { name: 'butter',           calories: 102, protein_g: 0.1, fat_total_g: 11.5,carbohydrates_total_g: 0   },
  { name: 'cheese',           calories: 113, protein_g: 7,   fat_total_g: 9,   carbohydrates_total_g: 0.4 },
  { name: 'chocolate',        calories: 155, protein_g: 2.2, fat_total_g: 9,   carbohydrates_total_g: 18  },
  { name: 'pizza',            calories: 285, protein_g: 12,  fat_total_g: 10,  carbohydrates_total_g: 36  },
  { name: 'burger',           calories: 295, protein_g: 17,  fat_total_g: 14,  carbohydrates_total_g: 24  },
  { name: 'pasta',            calories: 220, protein_g: 8,   fat_total_g: 1.3, carbohydrates_total_g: 43  },
  { name: 'coffee',           calories: 5,   protein_g: 0.3, fat_total_g: 0,   carbohydrates_total_g: 0   },
  { name: 'tea',              calories: 2,   protein_g: 0,   fat_total_g: 0,   carbohydrates_total_g: 0.5 },
  { name: 'juice',            calories: 112, protein_g: 0.7, fat_total_g: 0.5, carbohydrates_total_g: 26  },
  { name: 'samosa',           calories: 262, protein_g: 3.5, fat_total_g: 17,  carbohydrates_total_g: 24  },
  { name: 'idli',             calories: 39,  protein_g: 1.9, fat_total_g: 0.2, carbohydrates_total_g: 8   },
  { name: 'dosa',             calories: 133, protein_g: 3.7, fat_total_g: 3.7, carbohydrates_total_g: 22  },
  { name: 'peanut butter',    calories: 188, protein_g: 8,   fat_total_g: 16,  carbohydrates_total_g: 6   },
  { name: 'almonds',          calories: 164, protein_g: 6,   fat_total_g: 14,  carbohydrates_total_g: 6   },
  { name: 'salmon',           calories: 208, protein_g: 20,  fat_total_g: 13,  carbohydrates_total_g: 0   },
  { name: 'tuna',             calories: 109, protein_g: 24,  fat_total_g: 1,   carbohydrates_total_g: 0   },
  { name: 'spinach',          calories: 23,  protein_g: 2.9, fat_total_g: 0.4, carbohydrates_total_g: 3.6 },
  { name: 'broccoli',         calories: 55,  protein_g: 3.7, fat_total_g: 0.6, carbohydrates_total_g: 11  },
  { name: 'watermelon',       calories: 30,  protein_g: 0.6, fat_total_g: 0.2, carbohydrates_total_g: 8   },
];

function parseQuantity(text) {
  const match = text.match(/^[\d.]+\s*/);
  return match ? parseFloat(match[0]) : 1;
}

function localFoodSearch(queryStr) {
  const parts = queryStr.toLowerCase().split(/\band\b|,/);
  const results = [];
  for (const part of parts) {
    const trimmed = part.trim();
    const qty = parseQuantity(trimmed);
    const matched = LOCAL_FOODS.find(f => trimmed.includes(f.name));
    if (matched) {
      results.push({
        name: matched.name,
        calories:               Math.round(matched.calories * qty),
        protein_g:              Math.round(matched.protein_g * qty * 10) / 10,
        fat_total_g:            Math.round(matched.fat_total_g * qty * 10) / 10,
        carbohydrates_total_g:  Math.round(matched.carbohydrates_total_g * qty * 10) / 10,
      });
    }
  }
  return results;
}

// @desc    Get nutrition data from CalorieNinjas API (with local fallback)
// @route   GET /api/health/nutrition
// @access  Private
const getNutritionDetails = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    const cleanQuery = query.trim();
    if (process.env.CALORIE_NINJAS_KEY) {
      try {
        const response = await axios.get('https://api.calorieninjas.com/v1/nutrition', {
          params: { query: cleanQuery },
          headers: { 'X-Api-Key': process.env.CALORIE_NINJAS_KEY },
          timeout: 6000
        });
        const items = response.data?.items || [];
        if (items.length > 0) return res.status(200).json({ items, source: 'api' });
      } catch (apiErr) {
        console.log("CalorieNinjas fallback:", apiErr.message);
      }
    }
    const items = localFoodSearch(cleanQuery);
    if (items.length === 0) {
      return res.status(200).json({ items: [], source: 'local', hint: 'Try common food names like "banana", "oatmeal", "rice".' });
    }
    return res.status(200).json({ items, source: 'local' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

const FALLBACK_EXERCISES = {
  yoga: [
    { name: "Cobra Pose (Bhujangasana)", target: "spine & core", equipment: "body weight", bodyPart: "waist", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><path d='M20,80 Q50,70 80,80 Q70,50 60,30 Q50,20 40,25 Q35,30 30,50 Z' fill='none' stroke='%23c084fc' stroke-width='3' stroke-linecap='round'/><circle cx='42' cy='22' r='4' fill='%23c084fc'/></svg>" },
    { name: "Child's Pose (Balasana)", target: "back & shoulders", equipment: "body weight", bodyPart: "back", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><path d='M20,80 Q40,65 60,75 Q80,80 85,80 Q70,60 50,60 Q35,60 20,80' fill='none' stroke='%23c084fc' stroke-width='3' stroke-linecap='round'/><circle cx='80' cy='75' r='4' fill='%23c084fc'/></svg>" },
    { name: "Downward-Facing Dog", target: "hamstrings & calves", equipment: "body weight", bodyPart: "lower legs", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><path d='M20,80 L50,30 L80,80 M50,30 L45,40' fill='none' stroke='%23c084fc' stroke-width='3' stroke-linecap='round'/><circle cx='50' cy='25' r='4' fill='%23c084fc'/></svg>" }
  ],
  cardio: [
    { name: "Jumping Jacks", target: "cardiovascular system", equipment: "body weight", bodyPart: "cardio", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><circle cx='50' cy='25' r='6' fill='%23fb923c'/><line x1='50' y1='31' x2='50' y2='60' stroke='%23fb923c' stroke-width='4'/><line x1='50' y1='38' x2='20' y2='20' stroke='%23fb923c' stroke-width='3.5' stroke-linecap='round'/><line x1='50' y1='38' x2='80' y2='20' stroke='%23fb923c' stroke-width='3.5' stroke-linecap='round'/><line x1='50' y1='60' x2='30' y2='85' stroke='%23fb923c' stroke-width='3.5' stroke-linecap='round'/><line x1='50' y1='60' x2='70' y2='85' stroke='%23fb923c' stroke-width='3.5' stroke-linecap='round'/></svg>" },
    { name: "Mountain Climbers", target: "cardiovascular system", equipment: "body weight", bodyPart: "cardio", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><path d='M25,75 L45,45 L75,55 M45,45 L50,35 M75,55 L85,75' fill='none' stroke='%23fb923c' stroke-width='3.5' stroke-linecap='round'/><circle cx='50' cy='30' r='5' fill='%23fb923c'/></svg>" },
    { name: "Burpees", target: "cardiovascular system", equipment: "body weight", bodyPart: "cardio", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><circle cx='50' cy='20' r='5' fill='%23fb923c'/><path d='M30,80 L40,60 L50,40 L65,30 M65,30 L80,20' fill='none' stroke='%23fb923c' stroke-width='3.5' stroke-linecap='round'/></svg>" }
  ],
  strength: [
    { name: "Push-ups", target: "pectorals", equipment: "body weight", bodyPart: "chest", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><line x1='15' y1='75' x2='85' y2='75' stroke='%23475569' stroke-width='3'/><path d='M25,72 L75,52 M75,52 L80,72' fill='none' stroke='%2360a5fa' stroke-width='4' stroke-linecap='round'/><circle cx='75' cy='46' r='5' fill='%2360a5fa'/></svg>" },
    { name: "Bodyweight Squats", target: "quadriceps", equipment: "body weight", bodyPart: "upper legs", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><circle cx='50' cy='25' r='5' fill='%2360a5fa'/><path d='M50,30 L50,55 L35,55 L35,80 M50,40 L65,40' fill='none' stroke='%2360a5fa' stroke-width='4' stroke-linecap='round'/></svg>" },
    { name: "Plank", target: "abs", equipment: "body weight", bodyPart: "waist", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><line x1='20' y1='65' x2='80' y2='65' stroke='%2360a5fa' stroke-width='4' stroke-linecap='round'/><circle cx='75' cy='58' r='5' fill='%2360a5fa'/></svg>" }
  ],
  "general fitness": [
    { name: "Walking Lunges", target: "glutes & quads", equipment: "body weight", bodyPart: "upper legs", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><circle cx='50' cy='25' r='5' fill='%2334d399'/><path d='M50,30 L50,50 L35,65 L35,85 M50,50 L65,65 L65,85' fill='none' stroke='%2334d399' stroke-width='4' stroke-linecap='round'/></svg>" },
    { name: "Bicycle Crunches", target: "abs", equipment: "body weight", bodyPart: "waist", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><path d='M25,60 Q50,45 75,60 M50,50 L40,30 M50,50 L60,30' fill='none' stroke='%2334d399' stroke-width='4' stroke-linecap='round'/><circle cx='75' cy='52' r='5' fill='%2334d399'/></svg>" },
    { name: "Glute Bridges", target: "glutes", equipment: "body weight", bodyPart: "upper legs", gifUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e1b4b'/><path d='M20,70 Q50,40 80,70' fill='none' stroke='%2334d399' stroke-width='4' stroke-linecap='round'/><circle cx='80' cy='63' r='5' fill='%2334d399'/></svg>" }
  ]
};

// @desc    Get custom fitness plan
// @route   GET /api/health/fitness-plan
// @access  Private
const getFitnessPlan = async (req, res) => {
  try {
    const latestLog = await HealthLog.findOne({ user: req.user.id }).sort({ date: -1 });
    if (!latestLog) {
      return res.status(404).json({ message: 'No health log found. Please log your health metrics today!' });
    }
    const { caloriesConsumed = 0, sleepHours = 8, waterGlasses = 8, workoutMinutes = 30, mood = 'Good' } = latestLog;
    const issues = [];
    if (sleepHours < 6) issues.push('poor_sleep');
    if (waterGlasses < 6) issues.push('dehydration');
    if (caloriesConsumed > 2500) issues.push('high_calories');
    if (workoutMinutes < 20) issues.push('inactive');
    if (mood === 'Bad' || mood === 'Terrible') issues.push('stress');

    let category = 'general fitness';
    if (issues.includes('stress') || issues.includes('poor_sleep')) category = 'yoga';
    else if (issues.includes('high_calories')) category = 'cardio';
    else if (issues.includes('inactive')) category = 'strength';

    let exercises = [];
    const apiKey = process.env.RAPIDAPI_KEY;
    try {
      let url = 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/waist';
      if (category === 'yoga') url = 'https://exercisedb.p.rapidapi.com/exercises/name/stretch';
      else if (category === 'cardio') url = 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/cardio';
      else if (category === 'strength') url = 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/upper%20legs';

      const response = await axios.get(url, {
        params: { limit: '10' },
        headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'exercisedb.p.rapidapi.com' },
        timeout: 8000
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        exercises = response.data.map(item => ({
          name: item.name,
          target: item.target,
          equipment: item.equipment,
          bodyPart: item.bodyPart,
          gifUrl: `${backendUrl}/api/health/exercise-gif/${item.id}`
        }));
      }
    } catch (apiErr) {
      console.error('[FitnessPlan] ExerciseDB API fallback:', apiErr.message);
    }

    if (exercises.length === 0) {
      exercises = FALLBACK_EXERCISES[category] || FALLBACK_EXERCISES['general fitness'];
    }

    res.status(200).json({ category, issues, exercises });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Failed to generate fitness plan' });
  }
};

// @desc    Proxy ExerciseDB GIF images securely
// @route   GET /api/health/exercise-gif/:exerciseId
// @access  Public
const getExerciseGif = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const response = await axios({
      method: 'get',
      url: 'https://exercisedb.p.rapidapi.com/image',
      params: { exerciseId, resolution: '360' },
      headers: { 'x-rapidapi-key': process.env.RAPIDAPI_KEY, 'x-rapidapi-host': 'exercisedb.p.rapidapi.com' },
      responseType: 'stream',
      timeout: 8000
    });
    res.setHeader('Content-Type', 'image/gif');
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load exercise animation' });
  }
};

module.exports = { getHealthLogs, addHealthLog, getNutritionDetails, getFitnessPlan, getExerciseGif };
