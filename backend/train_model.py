import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

data = []

for _ in range(5000):

    sleep = np.random.uniform(3, 10)
    exercise = np.random.uniform(0, 7)
    water = np.random.uniform(0.5, 5)

    income = np.random.uniform(10000, 150000)
    expenses = np.random.uniform(5000, 120000)

    coding = np.random.uniform(0, 10)

    # Target scores

    health = (
        sleep * 8
        + exercise * 4
        + water * 5
    )

    finance = (
        (income - expenses) / 1000
    )

    career = (
        coding * 10
    )

    health = min(100, max(0, health))
    finance = min(100, max(0, finance))
    career = min(100, max(0, career))

    data.append([
        sleep,
        exercise,
        water,
        income,
        expenses,
        coding,
        health,
        finance,
        career
    ])

df = pd.DataFrame(data, columns=[
    "sleep",
    "exercise",
    "water",
    "income",
    "expenses",
    "coding",
    "health",
    "finance",
    "career"
])

X = df[[
    "sleep",
    "exercise",
    "water",
    "income",
    "expenses",
    "coding"
]]

Y = df[[
    "health",
    "finance",
    "career"
]]

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X, Y)

joblib.dump(model, "vitacore_model.pkl")

print("Model Saved Successfully")