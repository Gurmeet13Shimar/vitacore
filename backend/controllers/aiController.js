const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const getRecommendations = async (req, res) => {
  try {
    const { domain, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ recommendation: "Gemini API Key missing. Please provide API key in .env file to get real recommendations." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `As a PersonaTwin AI companion, provide a personalized recommendation for the domain: ${domain}. Context: ${JSON.stringify(context)}. Keep the response concise, encouraging, and actionable.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ recommendation: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: 'Error generating recommendation' });
  }
};

const simulateScenario = async (req, res) => {
  try {
    const { scenario } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ analysis: "Gemini API Key missing. Simulation not available." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this "What-if" scenario for a user: "${scenario}". Provide potential outcomes, timelines, and trade-offs.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ analysis: text });
  } catch (error) {
    res.status(500).json({ message: 'Error simulating scenario' });
  }
}

module.exports = { getRecommendations, simulateScenario };
