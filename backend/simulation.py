
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from ml.health_prediction import router as health_router
from ml.finance_prediction import router as finance_router

app = FastAPI()

app.include_router(health_router)
app.include_router(finance_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained ML model
model = joblib.load("vitacore_simulator.pkl")


class UserData(BaseModel):
    sleep: float
    exercise: float
    water: float
    expenses: float
    income: float
    codingHours: float


@app.get("/")
def home():
    return {"message": "VitaCore ML Simulation Running"}


@app.post("/simulate")
def simulate(data: UserData):

    features = [[
        data.sleep,
        data.exercise,
        data.water,
        data.income,
        data.expenses,
        data.codingHours
    ]]

    prediction = model.predict(features)[0]

    health_score = round(float(prediction[0]), 2)
    finance_score = round(float(prediction[1]), 2)
    career_score = round(float(prediction[2]), 2)

    overall = round(
        (health_score + finance_score + career_score) / 3,
        2
    )

    savings = data.income - data.expenses

    if overall > 80:
        insight = "Your future looks stable and productive."
    elif overall > 60:
        insight = "You are improving but need more consistency."
    else:
        insight = "Your current lifestyle may lead to burnout."

    return {
        "health_score": health_score,
        "finance_score": finance_score,
        "career_score": career_score,
        "overall_score": overall,
        "monthly_savings": savings,
        "insight": insight
    }