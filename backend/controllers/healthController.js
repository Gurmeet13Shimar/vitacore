const HealthLog = require('../models/HealthLog');
const axios = require('axios');

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
    const { workoutMinutes, caloriesBurned, caloriesConsumed, sleepHours, waterGlasses, mood, date } = req.body;
    const log = await HealthLog.create({
      user: req.user.id,
      date: date || Date.now(),
      workoutMinutes,
      caloriesBurned,
      caloriesConsumed,
      sleepHours,
      waterGlasses,
      mood
    });
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
  const match = text.match(/^([\d.]+)\s*/);
  return match ? parseFloat(match[1]) : 1;
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

    // Try CalorieNinjas API first (if key is set)
    if (process.env.CALORIE_NINJAS_KEY) {
      try {
        console.log('[CalorieNinjas] Searching for:', cleanQuery);
        const response = await axios.get('https://api.calorieninjas.com/v1/nutrition', {
          params: { query: cleanQuery },
          headers: { 'X-Api-Key': process.env.CALORIE_NINJAS_KEY },
          timeout: 6000
        });
        const items = response.data?.items || [];
        if (items.length > 0) {
          console.log('[CalorieNinjas] Success, items:', items.length);
          return res.status(200).json({ items, source: 'api' });
        }
      } catch (apiErr) {
        console.log("Status:", apiErr.response?.status);
  console.log("Data:", apiErr.response?.data);
  console.log("Message:", apiErr.message);
      }
    }

    // Local fallback
    console.log('[LocalFoods] Searching for:', cleanQuery);
    const items = localFoodSearch(cleanQuery);
    if (items.length === 0) {
      return res.status(200).json({ items: [], source: 'local', hint: 'Try common food names like "banana", "oatmeal", "rice".' });
    }
    return res.status(200).json({ items, source: 'local' });

  } catch (error) {
    console.error('[Nutrition] Unexpected error:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { getHealthLogs, addHealthLog, getNutritionDetails };
