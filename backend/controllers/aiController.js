const axios = require("axios");
console.log("OPENROUTER KEY:", process.env.OPENROUTER_API_KEY);
const getRecommendations = async (req, res) => {
  try {
    const { domain, context } = req.body;

    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return res.status(200).json({
        recommendation:
          "OpenRouter API Key missing. Please provide API key in .env file.",
      });
    }

    const prompt = `
You are VitaCore Neural AI — an advanced futuristic life assistant.

Domain: ${domain}

User Context:
${JSON.stringify(context)}

Instructions:
- Give personalized and intelligent insights
- Sound futuristic and analytical
- Keep responses concise but impactful
- Avoid generic motivation
- Mention trends, predictions, improvements, or risks

Domain-specific intelligence:
- Finance → spending analysis, savings, budgeting, investments
- Health → sleep quality, workouts, hydration, calories
- Career → productivity, learning, focus, growth
- Goals → consistency tracking and future projections

Speak naturally like an advanced AI companion.
`;

    // Fallback list of models to ensure high availability
    const modelsToTry = ["google/gemini-2.5-flash", "meta-llama/llama-3-8b-instruct:free", "openai/gpt-3.5-turbo"];
    let responseText = "";
    let success = false;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: model,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 10000 // 10s timeout per attempt
          }
        );

        if (response.data?.choices?.[0]?.message?.content) {
          responseText = response.data.choices[0].message.content;
          success = true;
          break;
        }
      } catch (genError) {
        console.warn(`OpenRouter model ${model} failed:`, genError.response?.data || genError.message);
        lastError = genError;
      }
    }

    if (success) {
      res.status(200).json({
        recommendation: responseText,
      });
    } else {
      console.error("All OpenRouter models failed. Last error:", lastError?.response?.data || lastError);
      res.status(200).json({
        recommendation:
          "AI Engine is currently running in local telemetry preview mode due to an API error.",
      });
    }
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      message: "Error generating recommendation",
    });
  }
};

const simulateScenario = async (req, res) => {
  try {
    const { scenario } = req.body;

    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return res.status(200).json({
        analysis:
          "OpenRouter API Key missing. Simulation not available.",
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
`;

    // Fallback list of models to ensure high availability
    const modelsToTry = ["google/gemini-2.5-flash", "meta-llama/llama-3-8b-instruct:free", "openai/gpt-3.5-turbo"];
    let responseText = "";
    let success = false;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: model,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 10000 // 10s timeout per attempt
          }
        );

        if (response.data?.choices?.[0]?.message?.content) {
          responseText = response.data.choices[0].message.content;
          success = true;
          break;
        }
      } catch (genError) {
        console.warn(`OpenRouter model ${model} failed:`, genError.response?.data || genError.message);
        lastError = genError;
      }
    }

    if (success) {
      res.status(200).json({
        analysis: responseText,
      });
    } else {
      console.error("All OpenRouter simulation models failed. Last error:", lastError?.response?.data || lastError);
      res.status(200).json({
        analysis:
          "Simulation currently unavailable due to AI API issue. Please try adjusting your parameters.",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error simulating scenario",
    });
  }
};

module.exports = {
  getRecommendations,
  simulateScenario,
};