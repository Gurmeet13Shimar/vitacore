const axios = require("axios");
const getRecommendations = async (req, res) => {
  try {
    const { domain, context, message } = req.body;

    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
      return res.status(200).json({
        recommendation:
          "OpenRouter API Key missing. Please provide API key in .env file.",
      });
    }

const prompt = `
You are VitaCore AI, a personalized life assistant.

User Question:
${message}

Domain:
${domain}

User Context:
${JSON.stringify(context, null, 2)}

Instructions:
1. First analyze the user's context.
2. Answer the user's specific question.
3. Use the provided context only when relevant.
4. Give practical recommendations.
5. Avoid generic motivational advice.
6. Keep the response between 100-200 words.
7. Mention risks, opportunities, and next actions when applicable.

Examples:
- If the question is about sleep, focus on health metrics.
- If the question is about money, focus on finance metrics.
- If the question is about learning or jobs, focus on career metrics.
- If the question is unrelated to the context, answer normally but briefly.

Response:
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