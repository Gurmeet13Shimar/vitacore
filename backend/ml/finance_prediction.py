from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import pandas as pd
from datetime import datetime
import os

router = APIRouter()

# Load the trained Prophet model
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "finance_forecast_model.pkl")

# We'll load the model lazily or at startup. Let's load at startup if possible.
try:
    finance_model = joblib.load(model_path)
    print("Finance model loaded successfully.")
except Exception as e:
    print(f"Warning: Could not load finance model at {model_path}. Error: {e}")
    finance_model = None

class ForecastRequest(BaseModel):
    currentSavings: float

@router.post("/predict-finance-forecast")
def predict_finance_forecast(req: ForecastRequest):
    if not finance_model:
        return {"error": "Model not loaded. Please train the model first."}
    
    # Generate future dates for 90 days
    future = finance_model.make_future_dataframe(periods=90, freq="D")
    forecast = finance_model.predict(future)
    
    # Extract only the future 90 days
    forecast_future = forecast.tail(90)
    
    forecast30Days = req.currentSavings + forecast_future.head(30)["yhat"].sum()
    forecast60Days = req.currentSavings + forecast_future.head(60)["yhat"].sum()
    forecast90Days = req.currentSavings + forecast_future.head(90)["yhat"].sum()
    
    # Determine trend
    trend = "Growing" if forecast90Days > req.currentSavings else "Declining"
    
    # Dummy confidence for now, Prophet provides uncertainty intervals (yhat_lower, yhat_upper)
    confidence = 0.85
    
    return {
        "forecast30Days": round(forecast30Days, 2),
        "forecast60Days": round(forecast60Days, 2),
        "forecast90Days": round(forecast90Days, 2),
        "trend": trend,
        "confidence": confidence
    }

class SimulationRequest(BaseModel):
    currentSavings: float
    foodReductionPercent: float
    shoppingReductionPercent: float
    transportReductionPercent: float
    incomeIncreaseAmount: float

@router.post("/simulate-finance")
def simulate_finance(req: SimulationRequest):
    if not finance_model:
        return {"error": "Model not loaded."}
        
    future = finance_model.make_future_dataframe(periods=90, freq="D")
    forecast = finance_model.predict(future)
    forecast_future = forecast.tail(90)
    
    base_90_day_savings = req.currentSavings + forecast_future["yhat"].sum()
    
    # Assume arbitrary average daily spend for these categories based on historical or standard values.
    # To truly do this accurately, we need historical category averages for the user.
    # For now, we will simulate the additional savings by providing average daily proxy values.
    # E.g., user spends 500/day on food, 300 on shopping, 200 on transport.
    avg_daily_food = 500
    avg_daily_shopping = 300
    avg_daily_transport = 200
    
    daily_savings_addition = (
        (avg_daily_food * (req.foodReductionPercent / 100)) +
        (avg_daily_shopping * (req.shoppingReductionPercent / 100)) +
        (avg_daily_transport * (req.transportReductionPercent / 100)) +
        (req.incomeIncreaseAmount / 30) # Monthly increase converted to daily
    )
    
    optimized_90_day_savings = base_90_day_savings + (daily_savings_addition * 90)
    
    return {
        "baseline90DaySavings": round(base_90_day_savings, 2),
        "optimized90DaySavings": round(optimized_90_day_savings, 2),
        "additionalSavings": round((daily_savings_addition * 90), 2)
    }

class OptimizeRequest(BaseModel):
    currentSavings: float

@router.post("/optimize-finance")
def optimize_finance(req: OptimizeRequest):
    # Tests multiple scenarios
    # 1. Income +3000
    # 2. Shopping -30%
    # 3. Food -20%
    
    # Assuming the same daily proxies
    avg_daily_food = 500
    avg_daily_shopping = 300
    
    scenarios = [
        {"action": "Increase Income by ₹3000", "daily_savings": 3000 / 30},
        {"action": "Reduce Shopping by 30%", "daily_savings": avg_daily_shopping * 0.30},
        {"action": "Reduce Food Spending by 20%", "daily_savings": avg_daily_food * 0.20},
        {"action": "Increase Income by ₹5000", "daily_savings": 5000 / 30},
        {"action": "Reduce Transportation by 20%", "daily_savings": 200 * 0.20}
    ]
    
    # Calculate 90 day savings for each
    for s in scenarios:
        s["additionalSavings"] = round(s["daily_savings"] * 90, 2)
        
    # Sort by savings desc
    scenarios = sorted(scenarios, key=lambda x: x["additionalSavings"], reverse=True)
    
    top_3 = scenarios[:3]
    for i, s in enumerate(top_3):
        s["rank"] = i + 1
        del s["daily_savings"]
        
    return {
        "optimizations": top_3
    }
