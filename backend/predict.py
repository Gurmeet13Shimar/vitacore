import pandas as pd
import joblib

def predict_sleep_disorder(user_data):
    """
    Loads the trained machine learning model and makes a prediction on new user data.
    """
    # Load the saved model and target encoder
    try:
        saved_data = joblib.load('vitacore_model.pkl')
        model = saved_data['model']
        target_encoder = saved_data['target_encoder']
    except FileNotFoundError:
        print("Error: Model file 'vitacore_model.pkl' not found. Please run train_model.py first.")
        return

    # Convert user input dictionary to a DataFrame
    input_df = pd.DataFrame([user_data])

    # Make the prediction
    prediction_encoded = model.predict(input_df)
    
    # Decode the numerical prediction back to the original label (e.g., 'None', 'Insomnia')
    prediction_label = target_encoder.inverse_transform(prediction_encoded)

    print("--- User Input ---")
    for key, value in user_data.items():
        print(f"{key}: {value}")

    print(f"\n--- Prediction ---")
    print(f"Predicted Sleep Disorder: {prediction_label[0]}")

    # Optionally, show the prediction probabilities
    probs = model.predict_proba(input_df)[0]
    print("\n--- Prediction Probabilities ---")
    for cls, prob in zip(target_encoder.classes_, probs):
        print(f"{cls}: {prob:.2%}")

if __name__ == "__main__":
    # Example user inputs that match the features the model was trained on
    sample_user_input = {
        'Gender': 'Male',
        'Age': 28,
        'Occupation': 'Software Engineer',
        'Sleep Duration': 6.1,
        'Quality of Sleep': 6,
        'Physical Activity Level': 42,
        'Stress Level': 6,
        'BMI Category': 'Overweight',
        'Systolic': 126,
        'Diastolic': 83,
        'Heart Rate': 77,
        'Daily Steps': 4200
    }

    predict_sleep_disorder(sample_user_input)
