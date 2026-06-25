import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def generate_synthetic_data(n_samples=10000):
    np.random.seed(42)
    
    # Generate random features
    sleep = np.random.uniform(4.0, 10.0, n_samples)
    exercise = np.random.uniform(0.0, 7.0, n_samples)
    water = np.random.uniform(0.0, 12.0, n_samples)
    income = np.random.uniform(10000.0, 150000.0, n_samples)
    # Ensure expenses are realistically correlated with income
    expense_ratio = np.random.beta(5, 5, n_samples) # centered around 0.5
    expenses = income * expense_ratio
    coding_hours = np.random.uniform(0.0, 10.0, n_samples)
    
    # Compute logical targets
    # 1. Health Score
    sleep_score = np.clip(100.0 - np.abs(sleep - 8.0) * 12.0, 0.0, 100.0)
    exercise_score = np.clip(exercise * 15.0, 0.0, 100.0)
    water_score = np.clip(water * 10.0, 0.0, 100.0)
    health_base = (0.45 * sleep_score + 0.35 * exercise_score + 0.20 * water_score)
    health_noise = np.random.normal(0, 2.0, n_samples)
    health_score = np.clip(health_base + health_noise, 30.0, 100.0)
    
    # 2. Finance Score
    savings = income - expenses
    savings_rate = (savings / income) * 100.0
    finance_base = 50.0 + (savings_rate * 0.6)
    # Penalize negative savings/debt
    finance_base = np.where(savings < 0, 30.0 + savings_rate * 0.3, finance_base)
    finance_noise = np.random.normal(0, 2.0, n_samples)
    finance_score = np.clip(finance_base + finance_noise, 20.0, 100.0)
    
    # 3. Career Score
    study_score = np.clip(coding_hours * 12.0, 0.0, 100.0)
    sleep_factor = np.where(sleep < 6.0, 0.75, 1.0)
    career_base = study_score * sleep_factor + 30.0 * (1.0 - (study_score/100.0))
    career_noise = np.random.normal(0, 2.0, n_samples)
    career_score = np.clip(career_base + career_noise, 30.0, 100.0)
    
    df = pd.DataFrame({
        'sleep': sleep,
        'exercise': exercise,
        'water': water,
        'income': income,
        'expenses': expenses,
        'codingHours': coding_hours,
        'health_score': health_score,
        'finance_score': finance_score,
        'career_score': career_score
    })
    return df

def main():
    print("Generating synthetic lifestyle dataset...")
    df = generate_synthetic_data(10000)
    
    # Features and targets
    X = df[['sleep', 'exercise', 'water', 'income', 'expenses', 'codingHours']]
    y = df[['health_score', 'finance_score', 'career_score']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training multi-output RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    # Evaluation
    y_pred = model.predict(X_test)
    
    print("\n--- Model Evaluation Results ---")
    targets = ['Health Score', 'Finance Score', 'Career Score']
    for idx, name in enumerate(targets):
        mae = mean_absolute_error(y_test.iloc[:, idx], y_pred[:, idx])
        r2 = r2_score(y_test.iloc[:, idx], y_pred[:, idx])
        print(f"{name:15s} -> MAE: {mae:.4f} | R²: {r2:.4f}")
        
    # Save the model
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    model_save_path = os.path.join(ml_dir, "vitacore_simulator.pkl")
    joblib.dump(model, model_save_path)
    print(f"\nSaved Random Forest simulator model to: {model_save_path}")

if __name__ == "__main__":
    main()
