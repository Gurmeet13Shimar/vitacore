# 📚 VitaCore references & Learning Resources

This document compiles the **references, documentation portals, API resources, and conceptual research** that supported the development of the **VitaCore (Digital Twin OS)**.

---

## 🌐 1. External APIs & Web Services

These portals contain official documentations for the dynamic web integrations utilized in the backend:

* **CalorieNinjas API**
  * *Purpose*: Natural-language food parsing and macronutrient extraction.
  * *Reference Link*: [CalorieNinjas API Documentation](https://calorieninjas.com/api)
* **ExerciseDB API (via RapidAPI)**
  * *Purpose*: Muscle-targeted workouts and exercise animation streaming proxies.
  * *Reference Link*: [ExerciseDB API Reference](https://rapidapi.com/justin-m-1/api/exercisedb)
* **Novu Notification Center**
  * *Purpose*: E.164 phone SMS alerts and transaction event triggers.
  * *Reference Link*: [Novu Docs](https://docs.novu.co/)
* **OpenRouter API**
  * *Purpose*: LLM endpoint multiplexer routing between Google Gemini, Meta Llama, and OpenAI models.
  * *Reference Link*: [OpenRouter API Docs](https://openrouter.ai/docs)

---

## 🤖 2. Machine Learning & AI References

Publications and tooling documentations that formed the basis of our predictive models:

* **Scikit-Learn Random Forest Regressor**
  * *Concept*: Ensemble learning method utilizing randomized decision tree regressors to avoid overfitting.
  * *Reference Link*: [Scikit-Learn RandomForestRegressor API](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html)
* **FastAPI Web Framework**
  * *Concept*: High-performance ASGI Python framework used to serve the ML model.
  * *Reference Link*: [FastAPI Documentation](https://fastapi.tiangolo.com/)
* **Google Generative AI SDK**
  * *Concept*: Large Language Model integration with Gemini Flash endpoints.
  * *Reference Link*: [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)

---

## 💻 3. Frontend Libraries & Styling

Core documentation portals for the client side interface:

* **Vite build tool**
  * *Reference Link*: [Vite Guides](https://vite.dev/guide/)
* **React 18**
  * *Reference Link*: [React Documentation](https://react.dev/)
* **TypeScript**
  * *Reference Link*: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
* **Tailwind CSS v4**
  * *Reference Link*: [Tailwind CSS Docs](https://tailwindcss.com/docs)
* **Radix UI Primitives**
  * *Reference Link*: [Radix UI Documentation](https://www.radix-ui.com/primitives)
* **Recharts Visualizations**
  * *Reference Link*: [Recharts API](https://recharts.org/)
* **Framer Motion Animations**
  * *Reference Link*: [Framer Motion API Reference](https://www.framer.com/motion/)
* **Spline 3D WebGL**
  * *Reference Link*: [Spline Design Docs](https://spline.design/) / [Spline React Integration](https://github.com/splinetool/react-spline)
* **TanStack React Query**
  * *Reference Link*: [React Query Guides](https://tanstack.com/query/latest/docs/framework/react/overview)
* **React Hook Form**
  * *Reference Link*: [React Hook Form Docs](https://react-hook-form.com/get-started)
* **Zod Parsing Schema**
  * *Reference Link*: [Zod Documentation](https://zod.dev/)

---

## ⚙️ 4. Backend & Database Systems

Primary references for server routers, document models, and security layers:

* **Node.js Runtime**
  * *Reference Link*: [Node.js Documentation](https://nodejs.org/en/docs/)
* **Express Web Server**
  * *Reference Link*: [Express API Reference](https://expressjs.com/en/api.html)
* **MongoDB & Mongoose ODM**
  * *Reference Link*: [Mongoose Documentation](https://mongoosejs.com/docs/) & [MongoDB Manual](https://www.mongodb.com/docs/manual/)
* **JSON Web Tokens (JWT)**
  * *Reference Link*: [JWT.io Standard](https://jwt.io/introduction)
* **Bcrypt Hashing Algorithm**
  * *Reference Link*: [Bcryptjs NPM Registry](https://www.npmjs.com/package/bcryptjs)

---

## 🎓 5. Theoretical Concepts: The Digital Twin Paradigm

Literature on applying engineering digital twins to physiological and lifestyle indicators:

* **Human Digital Twin Concept**:
  * *Concept*: A digital replica of physical assets, processes, systems, or places. In health/wellness context, it maps metabolic, behavioral, and telemetry values to forecast degradation indices.
  * *Scientific References*:
    * *Gerber et al., "The Human Digital Twin: A Review"* — Discusses aggregating biometric health telemetry and modeling future physiological fatigue.
    * *IBM Digital Twin Technology Overview* — General principles of industrial digital twin simulation modeling.
