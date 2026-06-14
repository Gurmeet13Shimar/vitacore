import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

def main():
    # Paths
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    local_path = os.path.join(ml_dir, "..", "Sleep_health_and_lifestyle_dataset.csv")
    remote_url = "https://raw.githubusercontent.com/Ann805/Sleep/main/Sleep_health_and_lifestyle_dataset.csv"

    required_columns = [
        "Age", "Sleep Duration", "Quality of Sleep", "Physical Activity Level", 
        "Stress Level", "Heart Rate", "Daily Steps", "Sleep Disorder"
    ]

    df = None
    if os.path.exists(local_path):
        print(f"Checking local file: {local_path}")
        try:
            temp_df = pd.read_csv(local_path)
            # Match columns case-insensitively or exactly
            if all(col in temp_df.columns for col in required_columns):
                df = temp_df
                print("Local dataset is complete.")
            else:
                print("Local dataset is missing required columns. Trying GitHub URL...")
        except Exception as e:
            print(f"Error reading local file: {e}")

    if df is None:
        print(f"Downloading complete dataset from {remote_url}...")
        try:
            df = pd.read_csv(remote_url)
            df.to_csv(local_path, index=False)
            print(f"Saved complete dataset locally to: {local_path}")
        except Exception as e:
            print(f"Failed to download from GitHub: {e}")
            raise e

    # Data Cleaning & Preprocessing
    print("Preprocessing data...")
    # Map NaN in Sleep Disorder to 'None'
    df["Sleep Disorder"] = df["Sleep Disorder"].fillna("None")

    # Define features and target
    features_list = [
        "Age", "Sleep Duration", "Quality of Sleep", "Physical Activity Level",
        "Stress Level", "Heart Rate", "Daily Steps"
    ]
    
    X = df[features_list]
    Y = df["Sleep Disorder"]

    # Label encode target
    label_encoder = LabelEncoder()
    Y_encoded = label_encoder.fit_transform(Y)

    # Train-test split
    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y_encoded, test_size=0.2, random_state=42
    )

    # Train model
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, Y_train)

    # Accuracy check
    accuracy = model.score(X_test, Y_test)
    print(f"Model Accuracy on Test Set: {accuracy * 100:.2f}%")

    # Save artifacts
    model_path = os.path.join(ml_dir, "sleep_model.pkl")
    encoder_path = os.path.join(ml_dir, "label_encoder.pkl")
    
    joblib.dump(model, model_path)
    joblib.dump(label_encoder, encoder_path)
    
    print(f"Successfully saved: {model_path}")
    print(f"Successfully saved: {encoder_path}")

if __name__ == "__main__":
    main()
