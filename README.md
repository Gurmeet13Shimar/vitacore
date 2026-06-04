# 🧬 VitaCore — Human Digital Twin OS

**VitaCore** is a high-fidelity, full-stack **"Digital Twin OS"** designed to aggregate, optimize, and gamify life's core telemetry metrics: **Health**, **Finance**, and **Career**.

Imagine the concept of a "Digital Twin" used in advanced aerospace or industrial engineering—where a real-time virtual replica of a jet engine or smart factory is compiled to run simulations, monitor stress thresholds, and predict failures before they manifest. **VitaCore applies this exact engineering principle to human life.** By capturing daily biometric signals, financial cash flows, and professional learning velocity, VitaCore compiles a virtual clone of your profile to simulate future trajectories, establish routine presets, and deliver diagnostic insights.

---

## 🚀 How to Explain the Project (The Elevator Pitch)

> *"VitaCore is a personal Digital Twin platform. Instead of tracking your life in separate, disconnected apps, VitaCore unifies your Health, Wealth, and Career into a single, high-fidelity virtual replica of yourself. Through our hybrid AI Simulation Engine, you can dial in sliders—such as study hours, savings rates, and sleep cycles—to run future forecasts (e.g. projecting how your current habits will impact your overall health score and net capital over the next six months) so you can make optimal choices in the physical world today."*

---

## 🗺️ System Architecture & Data Flow

VitaCore is built using a modern decoupled, full-stack architecture:

```
                  ┌────────────────────────────────────────┐
                  │          Vite + React Frontend         │
                  │   Tailwind v4 | Radix UI | Spline 3D   │
                  └───────────┬────────────────┬───────────┘
                              │                │
                     (REST)   │                │   (REST)
         ┌────────────────────┘                └────────────────────┐
         ▼                                                          ▼
┌──────────────────┐                                       ┌──────────────────┐
│ Express Backend  │                                       │ FastAPI ML Server│
│ Node.js Service  │                                       │ Python Service   │
└────────┬─────────┘                                       └────────┬─────────┘
         │                                                          │
         ├─► MongoDB Atlas (Data Ledger)                            └─► Random Forest
         │                                                             (vitacore_model.pkl)
         ├─► OpenRouter Multi-Model Cloud (AI Loop)
         │    ├── Primary: Google Gemini 2.5 Flash
         │    ├── Fallback 1: Llama 3 8B Instruct (Free)
         │    └── Fallback 2: OpenAI GPT-3.5 Turbo
         │
         ├─► CalorieNinjas API (Nutrition NLP)
         │
         ├─► ExerciseDB API (Dynamic Workout Gifs)
         │
         └─► Novu API (Out-of-bound SMS Alerts)
```

---

## 🛠️ Complete Technology Stack

### 1. Frontend Client (`/frontend`)
* **Core Framework**: **React 18** with **TypeScript** and **Vite** for optimized, modular client-side rendering (SPA) and fast Hot Module Replacement.
* **Styling & Themes**: **Tailwind CSS v4** coupled with **Radix UI Primitives** for custom astronautical dark spaceship theme variables, glassmorphic cards (`.glass-card`), and neon accent transitions.
* **Animations & Interactive Graphics**:
  * **Framer Motion**: Spring-physics layout animations, hover states, and smooth modal overlays.
  * **Spline 3D Runtime (`@splinetool/react-spline`)**: Embeds interactive WebGL 3D avatar mesh modules on landing and overview pages that track cursor movement.
* **Data Visualization**: **Recharts** for rendering high-fidelity biometric trend area charts, nutritional macro balance wheels, financial asset histories, and career radar metrics.
* **Data Access & Forms**:
  * **TanStack React Query + Axios**: Standardizes async query caching, automatic server refetches, and optimistic UI logs.
  * **React Hook Form + Zod**: Provides high-performance, uncontrolled numeric input states verified by type-safe schemas to prevent input lag.
* **Routing**: **React Router Dom** and **Wouter** for clean frontend URL navigation.

### 2. Primary API Backend Server (`/backend`)
* **Runtime Environment**: **Node.js** handling lightweight HTTP transactions.
* **Server Framework**: **Express** serving JSON API endpoints and proxies.
* **Database Interface**: **Mongoose** mapping flexible document schemas to a document-oriented database.
* **Security & Auth**: **JSON Web Tokens (JWT)** for stateless session authorizations and **Bcryptjs** for secure cryptographic password hashing.
* **Uploads**: **Multer** managing modular profile and ledger image attachments.

### 3. Database Layer
* **MongoDB**: A document-oriented database chosen for schema flexibility, mapping JSON telemetry values directly to user structures without heavy SQL table migrations.

### 4. Machine Learning & FastAPI Server (`/backend`)
* **Service Framework**: **FastAPI** (Python 3) serving fast, lightweight endpoints for numerical predictions.
* **Estimator Model**: **Random Forest Regressor** (`scikit-learn` / `joblib`), trained on 5,000 multi-dimensional logs mapping feature inputs `[sleep, exercise, water, income, expenses, coding]` to outputs `[health, finance, career]`.

---

## 🔌 Integrated External APIs & AI Models

VitaCore connects several third-party services and AI configurations:

1. **Google Gemini 2.5 Flash (via OpenRouter)**: The primary LLM executing qualitative scenario simulations (identifying risks, benefits, and timelines) and recommendations.
2. **Multi-Model Fallback Sequence**: If Gemini fails, the Express server cascades the request to **Meta Llama 3 8B Instruct** and then **OpenAI GPT-3.5 Turbo** to guarantee uptime.
3. **CalorieNinjas API**: Translates user-typed nutrition logs (e.g., "1 avocado and 200g yogurt") into numeric carbohydrate, protein, fat, and calorie totals. Offers a static local database fallback.
4. **ExerciseDB API**: Retrieves muscle-targeted exercise logs and proxied animations matching user fatigue indicators. Offers a dynamic vector fallback database.
5. **Novu SMS Platform**: Triggers background E.164 notifications to users' mobile phones when biometric indexes dip below health thresholds (e.g., dehydration, sleep deprivation).

---

## 📂 Core Folder Structure

```
vitacore/
├── backend/
│   ├── config/                  # DB Connection and System Configs
│   ├── controllers/             # Request controllers (Auth, AI, Health, Career, etc.)
│   ├── middleware/              # Auth authentication and request validation
│   ├── models/                  # Mongoose MongoDB Schemas (User, HealthLog, Expense, StudyLog, Goal)
│   ├── routes/                  # API endpoints routes definition
│   ├── services/                # External microservice interfaces
│   ├── utils/                   # Helper functions (SMS helpers, parsers)
│   ├── server.js                # Primary backend entrypoint
│   ├── train_model.py           # Python script training the Random Forest model
│   ├── simulation.py            # FastAPI service running RandomForest simulator
│   └── vitacore_model.pkl       # Serialized Random Forest model artifact
│
└── frontend/
    ├── src/
    │   ├── components/          # Reusable shared UI layout components
    │   ├── context/             # Global authentication and state context
    │   ├── data/                # Static mock configurations and options
    │   ├── hooks/               # Custom React state hooks
    │   ├── lib/                 # Tailwind classes merges utility
    │   ├── pages/               # Primary Page Components (Dashboard, Health, Simulator, Achievements, etc.)
    │   ├── App.tsx              # Main React App routing component
    │   ├── index.css            # Base stylesheet containing Tailwind v4 layers and custom glass styles
    │   └── main.tsx             # Client mounting entrypoint
```

---

## ⚙️ Environment Variables Setup

### Backend Environment Variables (`backend/.env`)
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vitacore
JWT_SECRET=your_jwt_signing_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
CALORIE_NINJAS_KEY=your_calorieninjas_api_key_here
RAPIDAPI_KEY=your_exercisedb_rapidapi_key_here
NOVU_SECRET_KEY=your_novu_secret_key_here
BACKEND_URL=http://localhost:5000
```

### Frontend Environment Variables (`frontend/.env`)
Create a `.env` file inside the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
VITE_ML_URL=http://localhost:8000
```

---

## 🏃 Local Setup & Run Instructions

To spin up all nodes of the Digital Twin system locally:

### 1. Prerequisite Checks
Ensure you have **Node.js (v18+)**, **MongoDB** (local or Atlas cluster), and **Python (3.9+)** installed.

### 2. Start the Primary Backend API
```bash
cd backend
npm install
npm run dev
```
*App launches on `http://localhost:5000`.*

### 3. Spin Up the FastAPI ML Server
Install Python dependencies, train the Random Forest model, and start the FastAPI service:
```bash
cd backend
# Create and activate virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate       # On Windows
source venv/bin/activate    # On macOS/Linux

# Install requirements
pip install fastapi uvicorn scikit-learn pandas numpy joblib

# (Optional) Retrain model
python train_model.py

# Launch FastAPI Simulation Engine
uvicorn simulation:app --reload --port 8000
```
*ML Simulation server launches on `http://localhost:8000`.*

### 4. Launch the Vite Frontend Client
```bash
cd frontend
npm install
npm run dev
```
*Vite compiles assets and hosts the interface on `http://localhost:5173`.*

---

## 💎 Novelty & Automation Highlights

* **Adaptive Health alerts**: Built-in triggers catch dehydration (< 6 glasses of water) or low sleep (< 6 hours) instantly dispatching warning SMS alerts to the user's phone via Novu.
* **Grayscale-to-Glow Badging**: Locked badges rendered in desaturated grayscale transform into glowing, neon-bordered icons via Framer Motion once user milestones are reached.
* **Autocompleting Skills radar**: Add custom study topics directly in the Career console to trace them dynamically in Recharts radar visualizers.
* **3D Twin Rendering**: Uses cursor-reactive 3D Spline files to model the state of the Digital Twin dashboard.
