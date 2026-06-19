import pandas as pd
import numpy as np
import joblib
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import os

# Define the absolute path for the dataset
current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(os.path.dirname(current_dir), "Personal_Finance_Dataset.csv")
model_save_path = os.path.join(current_dir, "finance_forecast_model.pkl")

print(f"Loading data from: {dataset_path}")
df = pd.read_csv(dataset_path)

print("Dataset Shape:", df.shape)

# DATA CLEANING
df["Date"] = pd.to_datetime(df["Date"])
df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce")
df = df.dropna(subset=["Date", "Amount"])

# CREATE NET CASH FLOW
df["NetAmount"] = np.where(df["Type"] == "Income", df["Amount"], -df["Amount"])

# DAILY CASH FLOW
daily_cashflow = df.groupby("Date")["NetAmount"].sum().reset_index()
daily_cashflow.columns = ["ds", "y"]

# FILL MISSING DATES
daily_cashflow = daily_cashflow.set_index("ds")
daily_cashflow = daily_cashflow.asfreq("D")
daily_cashflow["y"] = daily_cashflow["y"].fillna(0)
daily_cashflow = daily_cashflow.reset_index()

print("\nDaily Records:", len(daily_cashflow))

# TRAIN TEST SPLIT
split_index = int(len(daily_cashflow) * 0.8)
train = daily_cashflow.iloc[:split_index]
test = daily_cashflow.iloc[split_index:]

print("\nTrain Size:", len(train))
print("Test Size :", len(test))

# TRAIN MODEL
model = Prophet(
    daily_seasonality=True,
    weekly_seasonality=True,
    yearly_seasonality=True
)
model.fit(train)

# PREDICT TEST DATA
future_test = model.make_future_dataframe(periods=len(test), freq="D")
forecast_test = model.predict(future_test)

predictions = forecast_test[["ds", "yhat"]]
predictions = predictions[predictions["ds"].isin(test["ds"])]
merged = test.merge(predictions, on="ds", how="left").dropna()

# EVALUATION
mae = mean_absolute_error(merged["y"], merged["yhat"])
rmse = np.sqrt(mean_squared_error(merged["y"], merged["yhat"]))
mape = mean_absolute_percentage_error(merged["y"], merged["yhat"])

print("\n================================")
print("MODEL PERFORMANCE")
print("================================")
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"MAPE : {mape*100:.2f}%")

# SAVE MODEL
joblib.dump(model, model_save_path)
print(f"\nModel Saved Successfully to {model_save_path}")

# COMPUTE DATA-DRIVEN CATEGORY STATISTICS
import json
min_date = df["Date"].min()
max_date = df["Date"].max()
total_days = (max_date - min_date).days + 1

category_averages = {}
for cat in df["Category"].unique():
    cat_df = df[df["Category"] == cat]
    for t in cat_df["Type"].unique():
        subset = cat_df[cat_df["Type"] == t]
        avg = float(subset["Amount"].sum() / total_days)
        key = f"{cat}_{t}".lower().replace(" & ", "_").replace(" ", "_")
        category_averages[key] = round(avg, 2)

daily_range = float(daily_cashflow["y"].max() - daily_cashflow["y"].min())
confidence = round(max(0.5, min(0.99, 1.0 - (mae / daily_range))), 4) if daily_range > 0 else 0.85

meta = {
    "category_averages": category_averages,
    "confidence": confidence,
    "overall_daily_net_flow_average": round(float(daily_cashflow["y"].mean()), 2),
    "total_days": int(total_days)
}

meta_save_path = os.path.join(current_dir, "finance_meta.json")
with open(meta_save_path, "w") as f:
    json.dump(meta, f, indent=2)
print(f"Finance metadata saved to {meta_save_path}")

