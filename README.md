# 🧬 VitaCore — Digital Twin OS

> **Track yourself. Simulate your future. Optimize everything.**

VitaCore is a full-stack **AI-powered digital twin dashboard** that merges three life domains — **Health**, **Finance**, and **Career** — into a single, intelligent operating system for your life. It combines real-time biometric logging, machine learning simulations, generative AI coaching, and a live GitHub coding tracker into a premium glassmorphic interface.

---

## 🌟 Core Concept

Traditional tracker apps live in silos. VitaCore applies the **industrial "Digital Twin"** engineering concept to human life telemetry.

In aerospace and manufacturing, a virtual replica of a physical asset is created to monitor stress and run failure simulations. VitaCore does the same for *you* — aggregating health biometrics, financial ledgers, and career velocity into a unified virtual clone that models your future outcomes across all dimensions.

> **Key novelty:** Decisions in one lane (e.g., sleeping 4 hours to code longer) automatically degrade scores in another lane (health index drop). VitaCore makes these cross-domain tradeoffs visible and quantifiable.

---

## 🗂️ Project Structure

```
vitacore/
├── frontend/                  # React + TypeScript SPA (Vite)
│   └── src/
│       ├── pages/             # App pages (Health, Finance, Career, etc.)
│       ├── components/        # Shared UI components & layout
│       ├── context/           # Auth + Theme context providers
│       ├── hooks/             # Custom React hooks (useAuth, etc.)
│       └── lib/               # Axios API instance
│
├── backend/                   # Node.js + Express REST API
│   ├── controllers/           # Route handler logic
│   ├── routes/                # Express route definitions
│   ├── models/                # Mongoose schemas
│   ├── middleware/            # JWT auth middleware
│   ├── services/              # External API integrations
│   ├── config/                # Socket.IO setup
│   ├── simulation.py          # FastAPI ML service (Random Forest)
│   ├── train_model.py         # Model training script
│   ├── predict.py             # Prediction utilities
│   └── vitacore_model.pkl     # Trained sklearn model artifact
│
├── TECH_STACK.md              # Detailed architecture rationale
├── NOVELTY_AND_INNOVATION.md  # Innovation & API integration docs
└── REFERENCES.md              # External references
```

---

## 🚀 Features

### 🏥 Health Module
- **Daily Biometric Logging**: Track sleep hours, water intake (glasses), caloric consumption, workout duration, and stress levels
- **Natural Language Food Parser**: Type `"1 banana and 100g chicken"` — powered by the **CalorieNinjas API** with a local fallback nutrient database
- **Sleep Health Predictor**: A machine-learning model trained on the [Sleep Health & Lifestyle Dataset](https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset) predicts sleep disorders (None / Sleep Apnea / Insomnia) with risk levels (Low / Medium / High)
- **AI Personalized Workout Planner**: Analyzes biometric flags (dehydration, poor sleep, high calories) and dynamically queries **ExerciseDB API** for a tailored exercise plan with animated GIFs
- **Automatic SMS Alerts via Novu**: When health thresholds are breached (sleep < 6h, water < 6 glasses, calories > 2800 kcal), the system dispatches real-time SMS notifications to the user's registered phone number
- **Interactive Charts**: Area charts for sleep trends, pie wheels for macronutrient breakdown, and line charts for hydration history — all powered by **Recharts**

### 💰 Finance Module
- **Transaction Ledger**: Log income and expense transactions by category with date filtering
- **Financial Health Score**: Auto-computed from savings rate, income stability, and expense patterns
- **AI Finance Twin**: Analyzes the user's financial ledger and generates personalized budget advice, risk assessment, and action items via the **OpenRouter LLM chain**
- **Interactive Charts**: Area charts for balance trends, pie charts for category spend breakdown, bar charts for income vs. expense comparison
- **Monthly Budget Planner**: Set and track budget limits by category

### 💼 Career Module
- **Study Session Logger**: Log topics studied, duration, and notes — powering the skill radar chart and milestone tracker
- **Competency Radar Chart**: Auto-generated from logged study topics, visualizing skills like React, Node.js, MongoDB, Security, DevOps, and custom topics
- **Growth Milestones**: Progressive goals (10h → 25h → 50h study time) with animated progress bars
- **Study Habit Heatmap**: 60-day activity heatmap showing coding intensity by day
- **GitHub Career Integration**: Connect any GitHub username to automatically fetch:
  - Public repository count
  - Commits this week
  - Active coding days
  - Top languages used
  - **Career Activity Score** (0–100)
  - Dynamic career insights
  - **Achievement badges** (7-Day Streak, 50 Commits, Open Source Contributor, Project Builder)
- **Learning Platforms Hub**: Track streaks across LeetCode, HackerRank, Kaggle, Hugging Face, and freeCodeCamp — with expandable 60-day streak heatmaps per platform
- **Custom Platform Support**: Add any learning platform not in the built-in list

### 🤖 AI Simulator
- **Scenario Simulation Engine**: Set hypothetical parameters (sleep, exercise, water, income, expenses, study hours) using sliders and instantly project 6-month health, finance, and career trajectories
- **Dual-Layer Prediction**:
  1. **Local ML (Random Forest)**: Returns numeric index scores in <15ms
  2. **Cloud LLM (Multi-model chain)**: Generates qualitative scenario analysis with risks, benefits, and timelines
- **Multi-Model Fallback**: If Gemini 2.5 Flash fails → falls back to Llama 3 8B (free) → then GPT-3.5 Turbo

### 🎯 Goals Module
- Set personal goals with target values and deadlines across Health, Finance, and Career domains
- Progress tracking with visual completion indicators

### 🏆 Achievements
- Unlock badges based on real activity milestones (career score 99, study streaks, etc.)
- Gamified progression with grayscale-to-glow badge transitions powered by Framer Motion

### 🔔 Notifications
- Real-time in-app notifications via **Socket.IO**
- Out-of-band SMS alerts via **Novu**
- Daily summary cron job (midnight IST) delivering a personalized "Good Morning" digest to all users
- Notification categories: Health alerts, Career achievements, GitHub badges, System messages

### ⚙️ Settings
- User profile management (name, phone number, income)
- Theme switching (Dark / Light)
- Notification preferences

---

## 🧠 AI & Machine Learning

### Sleep Health Predictor (Scikit-learn)
- **Model**: Random Forest Classifier
- **Dataset**: [Sleep Health & Lifestyle Dataset](https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset) (374 samples)
- **Features**: Age, sleep duration, quality of sleep, physical activity level, stress level, BMI category, heart rate, daily steps, blood pressure
- **Output**: `Sleep Disorder` class (None / Sleep Apnea / Insomnia) + confidence probability
- **Served via**: FastAPI (`simulation.py`) auto-spawned by the Node.js server on port `8000`

### Life Simulator (Random Forest Regressor)
- **Model**: `RandomForestRegressor` trained on 5,000 synthetic multi-dimensional life logs
- **Input features**: sleep hours, exercise duration, water intake, income, expenses, coding hours
- **Output**: Health Index, Finance Index, Career Index (0–100 each)
- **Artifact**: `backend/vitacore_model.pkl`

### AI Recommendation & Simulation Engine (LLM)
- **Primary**: Google Gemini 2.5 Flash via `@google/generative-ai`
- **Fallback 1**: Meta Llama 3 8B Instruct (Free tier) via OpenRouter
- **Fallback 2**: OpenAI GPT-3.5 Turbo via OpenRouter
- **Endpoints**: `POST /api/ai/recommend` · `POST /api/ai/simulate`

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Component model, type safety |
| Vite | Ultra-fast dev server & bundler |
| Tailwind CSS v4 | Utility-first styling, glassmorphic design |
| Radix UI / Shadcn | Accessible headless UI primitives |
| Recharts | SVG-based data visualization |
| Framer Motion | Physics-based animations & transitions |
| Spline 3D | Interactive WebGL 3D avatar on homepage |
| Socket.IO Client | Real-time notification WebSocket |
| TanStack React Query | Server state & async data management |
| Axios | HTTP client with auth interceptors |
| React Hook Form + Zod | Performant forms + schema validation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Document database & ODM |
| JWT + Bcryptjs | Stateless auth & password hashing |
| Socket.IO | Real-time bi-directional events |
| node-cron | Scheduled background jobs |
| FastAPI + Uvicorn | Python ML model serving (auto-spawned) |
| Scikit-learn | Random Forest ML models |
| express-rate-limit | API abuse protection |

### External APIs
| API | Purpose |
|---|---|
| CalorieNinjas | Natural language food nutrition parsing |
| ExerciseDB (RapidAPI) | Personalized workout plan + GIF assets |
| Novu | Automated SMS + in-app notifications |
| OpenRouter | Multi-model LLM fallback chain |
| GitHub REST API | Career coding activity tracking |

---

## 🔌 API Reference

### Authentication — `/api/auth`
| Method | Route | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive JWT token |
| `GET` | `/profile` | Get authenticated user profile |
| `PUT` | `/profile` | Update user profile |

### Health — `/api/health`
| Method | Route | Description |
|---|---|---|
| `POST` | `/log` | Save a daily health log |
| `GET` | `/logs` | Get all health logs for user |
| `GET` | `/logs/latest` | Get the most recent log |
| `POST` | `/nutrition` | Parse food text → nutrients |
| `POST` | `/sleep-predict` | Run sleep disorder prediction |
| `GET` | `/workout-plan` | Fetch personalized workout plan |
| `GET` | `/exercise-gif/:id` | Proxy exercise GIF asset |

### Finance — `/api/finance`
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Get all transactions |
| `POST` | `/` | Create a transaction |
| `DELETE` | `/:id` | Delete a transaction |
| `GET` | `/twin` | Get AI financial twin analysis |

### Career — `/api/career`
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Get all study logs |
| `POST` | `/` | Save a study session |

### GitHub — `/api/github` *(JWT protected)*
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Get linked GitHub profile + stats |
| `GET` | `/:username` | Connect & fetch GitHub stats |
| `DELETE` | `/` | Disconnect GitHub profile |

### AI — `/api/ai` *(JWT protected)*
| Method | Route | Description |
|---|---|---|
| `POST` | `/recommend` | Get personalized AI recommendations |
| `POST` | `/simulate` | Run AI scenario simulation |

### Notifications — `/api/notifications`
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Get all user notifications |
| `PATCH` | `/:id/read` | Mark notification as read |
| `PATCH` | `/mark-all-read` | Mark all as read |
| `DELETE` | `/:id` | Delete notification |

### Goals — `/api/goals`
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Get all user goals |
| `POST` | `/` | Create a goal |
| `PUT` | `/:id` | Update goal progress |
| `DELETE` | `/:id` | Delete goal |

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.9 (with pip)
- **MongoDB** instance (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Gurmeet13Shimar/vitacore.git
cd vitacore
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173

# AI & External APIs
OPENROUTER_API_KEY=your-openrouter-key
CALORIE_NINJAS_KEY=your-calorieninjas-key
RAPIDAPI_KEY=your-rapidapi-key

# Novu Notifications
NOVU_SECRET_KEY=your-novu-secret-key
NOVU_SUBSCRIBER_ID=your-subscriber-id

# Optional: GitHub API Token (avoids rate limits)
GITHUB_TOKEN=your-github-personal-access-token
```

Install Python ML dependencies:
```bash
pip install scikit-learn pandas fastapi uvicorn
```

Train the model (first run only):
```bash
python train_model.py
```

Start the backend:
```bash
npm run dev
```
> The server auto-spawns the FastAPI ML service on port `8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER CLIENT                       │
│         React 18 + TypeScript + Vite (port 5173)        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Health  │ │ Finance  │ │  Career  │ │ Simulator │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │
│       │             │            │              │         │
│       └─────────────┴────────────┴──────────────┘        │
│                         Axios + Socket.IO                 │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / WebSocket
┌──────────────────────────▼──────────────────────────────┐
│               EXPRESS REST SERVER (port 5000)            │
│  JWT Middleware │ Rate Limiter │ CORS │ Socket.IO        │
│                                                          │
│  /api/auth   /api/health   /api/finance   /api/career   │
│  /api/ai     /api/github   /api/goals     /api/notifications│
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   MongoDB    │  │  FastAPI ML  │  │ External APIs │  │
│  │  (Mongoose)  │  │  port 8000   │  │ CalorieNinjas │  │
│  │  User data   │  │ Random Forest│  │ ExerciseDB    │  │
│  │  Logs, Goals │  │ Predictor    │  │ Novu / Novu   │  │
│  └──────────────┘  └──────────────┘  │ OpenRouter    │  │
│                                       │ GitHub API    │  │
│                                       └───────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │         LLM Multi-Model Fallback Chain            │   │
│  │  Gemini 2.5 Flash → Llama 3 8B → GPT-3.5 Turbo  │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security

- **JWT Authentication**: All sensitive routes (`/api/ai`, `/api/github`) are protected by the `protect` middleware which validates Bearer tokens
- **Password Hashing**: bcryptjs with salt rounds for all passwords
- **Rate Limiting**: `express-rate-limit` applied to AI endpoints to prevent API abuse
- **CORS**: Locked to the configured `CLIENT_URL` only
- **GitHub Token**: Optional env variable to avoid GitHub REST API rate limits (5000 req/hr with token vs. 60 req/hr anonymous)

---

## 🔔 Real-Time Events (Socket.IO)

| Event | Trigger | Payload |
|---|---|---|
| `notification` | New in-app notification | `{ title, message, type }` |
| `github:achievement` | New GitHub badge unlocked | `{ badge, message }` |
| `health:alert` | Health threshold breached | `{ type, message }` |

---

## 📊 Daily Cron Job

A `node-cron` job runs every day at **midnight IST** (`Asia/Kolkata`):
- Fetches all registered users
- Dispatches a personalized "Good Morning" summary notification to each user's in-app notification center

---

## 🧪 Sleep Health Prediction Model

The sleep predictor is accessible via:
1. **Quick Prediction Button** in the Health page — uses the latest saved log as input
2. **Manual Quiz** — answer 10 targeted questions about lifestyle and biometrics

**Output classes:**
| Prediction | Risk Level | Meaning |
|---|---|---|
| None | Low | No sleep disorder detected |
| Sleep Apnea | Medium / High | Breathing disruption during sleep |
| Insomnia | Medium / High | Difficulty falling or staying asleep |

---

## 🎨 Design System

VitaCore uses a **premium dark glassmorphic design language**:
- **Primary palette**: Violet (`#8b5cf6`) · Pink (`#e91e8c`) · Amber (`#f5c518`)
- **Background**: Deep space dark (`#060412`)
- **Cards**: `glass-card` — `backdrop-blur-xl`, `bg-slate-900/80`, `border-slate-800/80`
- **Typography**: Inter (Google Fonts)
- **Animations**: Framer Motion spring physics for all hover states, badge unlocks, and page transitions
- **3D**: Spline WebGL scene on the landing/dashboard page

---

## 📄 Additional Documentation

| File | Contents |
|---|---|
| [`TECH_STACK.md`](./TECH_STACK.md) | Deep architectural rationale for every technology choice |
| [`NOVELTY_AND_INNOVATION.md`](./NOVELTY_AND_INNOVATION.md) | Innovation pillars, external API integrations, ML architecture |
| [`REFERENCES.md`](./REFERENCES.md) | External references and data sources |

---

## 📝 License

This project is for educational and demonstration purposes.

---

<div align="center">
  <strong>Built with ❤️ — Health + Finance + Career, unified.</strong>
</div>
