
# User input model
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS Middleware (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Input Model
class UserData(BaseModel):
    sleep: float
    exercise: float
    water: float
    expenses: float
    income: float
    codingHours: float


# Root Route
@app.get("/")
def home():
    return {"message": "VitaCore AI Simulation API Running"}


# Simulation Route
@app.post("/simulate")
def simulate(data: UserData):

    # Starting scores
    health_score = 100
    finance_score = 100
    career_score = 100

    # ---------------- HEALTH AI ----------------
    if data.sleep < 6:
        health_score -= 20

    if data.exercise < 3:
        health_score -= 15

    if data.water < 2:
        health_score -= 10

    # ---------------- FINANCE AI ----------------
    savings = data.income - data.expenses

    if savings < 10000:
        finance_score -= 25

    elif savings > 50000:
        finance_score += 10

    # ---------------- CAREER AI ----------------
    if data.codingHours < 2:
        career_score -= 20

    elif data.codingHours > 5:
        career_score += 10

    # Prevent negative values
    health_score = max(0, health_score)
    finance_score = max(0, finance_score)
    career_score = max(0, career_score)

    # ---------------- FINAL SCORE ----------------
    overall = (
        health_score +
        finance_score +
        career_score
    ) / 3

    # ---------------- AI INSIGHT ----------------
    if overall > 80:
        insight = "Your future looks stable and productive."

    elif overall > 60:
        insight = "You are improving but need more consistency."

    else:
        insight = "Your current lifestyle may lead to burnout."

    # ---------------- RETURN RESPONSE ----------------
    return {
        "health_score": health_score,
        "finance_score": finance_score,
        "career_score": career_score,
        "overall_score": round(overall, 2),
        "monthly_savings": savings,
        "insight": insight
    }