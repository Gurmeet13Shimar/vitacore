import os
import joblib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Paths
ml_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(ml_dir, "sleep_model.pkl")
encoder_path = os.path.join(ml_dir, "label_encoder.pkl")

# Load model and encoder safely
model = None
encoder = None

def load_artifacts():
    global model, encoder
    if os.path.exists(model_path) and os.path.exists(encoder_path):
        try:
            model = joblib.load(model_path)
            encoder = joblib.load(encoder_path)
            print("[HealthPrediction] Successfully loaded model and label encoder.")
        except Exception as e:
            print(f"[HealthPrediction] Error loading model artifacts: {e}")
    else:
        print("[HealthPrediction] Warning: Model/Encoder files not found. Run train_sleep_model.py first.")

# Initial load
load_artifacts()

class HealthRiskInput(BaseModel):
    age: int
    sleepDuration: float
    qualityOfSleep: int
    physicalActivity: float
    stressLevel: int
    heartRate: int
    dailySteps: int

@router.post("/predict-health-risk")
def predict_health_risk(data: HealthRiskInput):
    global model, encoder
    
    # Reload model if it wasn't loaded initially
    if model is None or encoder is None:
        load_artifacts()
        if model is None or encoder is None:
            raise HTTPException(
                status_code=500, 
                detail="ML model or encoder not found. Run train_sleep_model.py first."
            )

    try:
        # Format features exactly as trained
        features = [[
            data.age,
            data.sleepDuration,
            data.qualityOfSleep,
            data.physicalActivity,
            data.stressLevel,
            data.heartRate,
            data.dailySteps
        ]]

        # Prediction index
        pred_class_idx = model.predict(features)[0]
        # Map back to string label
        pred_label = encoder.inverse_transform([pred_class_idx])[0]

        # Confidence via probabilities
        proba = model.predict_proba(features)[0]
        confidence = round(float(proba[pred_class_idx]), 2)

        # Risk level logic
        if pred_label == "Sleep Apnea":
            risk_level = "High"
        elif pred_label == "Insomnia":
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Dynamic recommendations based on user telemetry boundaries
        recs = []
        if data.sleepDuration < 6.5:
            recs.append("Increase sleep duration to at least 7-8 hours.")
        if data.stressLevel > 6:
            recs.append("Reduce stress levels through mindfulness or yoga.")
        if data.physicalActivity < 30:
            recs.append("Increase daily physical activity levels.")
        if data.dailySteps < 5000:
            recs.append("Increase daily steps count.")
        if data.heartRate > 80:
            recs.append("Monitor heart rate and consult a professional.")

        if not recs:
            if pred_label == "None":
                recs.append("Maintain your current healthy lifestyle and sleep habits!")
            else:
                recs.append("Consult a doctor for specialized sleep hygiene advice.")

        recommendation = " ".join(recs)

        return {
            "prediction": pred_label,
            "confidence": confidence,
            "riskLevel": risk_level,
            "recommendation": recommendation
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
