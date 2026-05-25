const axios = require("axios");

const HealthLog =
  require("../models/HealthLog");

const Expense =
  require("../models/Expense");

const StudyLog =
  require("../models/StudyLog");

/* CHAT WITH AI */
const chatWithAI = async (req, res) => {

  try {

    const { message } = req.body;

    /* VALIDATION */
    if (!message) {

      return res.status(400).json({
        reply: "Message is required",
      });

    }

    /* FETCH DATABASE DATA */
    const latestHealth =
      await HealthLog.findOne()
        .sort({ createdAt: -1 });

    const latestExpense =
      await Expense.findOne()
        .sort({ createdAt: -1 });

    const latestStudy =
      await StudyLog.findOne()
        .sort({ createdAt: -1 });

    /* LOWERCASE MESSAGE */
    const lowerMessage =
      message.toLowerCase();

    let contextData = "";

    /* HEALTH QUESTIONS */
    if (

      lowerMessage.includes("health") ||
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("water") ||
      lowerMessage.includes("workout") ||
      lowerMessage.includes("calories") ||
      lowerMessage.includes("mood")

    ) {

      contextData = `

Health Data:
${JSON.stringify(latestHealth)}

`;

    }

    /* FINANCE QUESTIONS */
    else if (

      lowerMessage.includes("expense") ||
      lowerMessage.includes("expenses") ||
      lowerMessage.includes("money") ||
      lowerMessage.includes("finance") ||
      lowerMessage.includes("spending") ||
      lowerMessage.includes("budget")

    ) {

      contextData = `

Expense Data:
${JSON.stringify(latestExpense)}

`;

    }

    /* STUDY / CAREER QUESTIONS */
    else if (

      lowerMessage.includes("study") ||
      lowerMessage.includes("career") ||
      lowerMessage.includes("learning") ||
      lowerMessage.includes("productivity") ||
      lowerMessage.includes("goal")

    ) {

      contextData = `

Study Data:
${JSON.stringify(latestStudy)}

`;

    }

    /* DEFAULT */
    else {

      contextData = `

Health Data:
${JSON.stringify(latestHealth)}

Expense Data:
${JSON.stringify(latestExpense)}

Study Data:
${JSON.stringify(latestStudy)}

`;

    }

    /* OPENROUTER API CALL */
    const response = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {

        model:
          "openai/gpt-3.5-turbo",

        messages: [

          {
            role: "system",

            content:
              "You are VitaCore Neural AI. Give personalized futuristic insights based on user data. Keep answers concise and intelligent.",
          },

          {
            role: "user",

            content: `

User Message:
${message}

${contextData}

`,
          },
        ],
      },

      {

        headers: {

          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            "http://localhost:5173",

          "X-Title":
            "VitaCore",
        },
      }
    );

    /* AI RESPONSE */
    const text =
      response.data
        .choices[0]
        .message.content;

    console.log(
      "AI RESPONSE:",
      text
    );

    res.status(200).json({
      reply: text,
    });

  } catch (error) {

    console.log(
      "FULL ERROR:"
    );

    console.log(
      error.response?.data ||
      error.message
    );

    res.status(500).json({
      reply: "AI failed",
    });

  }

};

module.exports = {
  chatWithAI,
};