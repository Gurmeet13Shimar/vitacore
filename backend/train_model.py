import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# 1. Load the dataset
# Loading the provided CSV file containing real sleep, health, and lifestyle data
df = pd.read_csv('Sleep_health_and_lifestyle_dataset.csv')

# 2. Analyze all columns and identify
# Input features (X): Gender, Age, Occupation, Sleep Duration, Quality of Sleep, Physical Activity Level, Stress Level, BMI Category, Blood Pressure (split into Systolic/Diastolic), Heart Rate, Daily Steps
# Target column (Y): Sleep Disorder

# 3. Handle missing values appropriately
# The "Sleep Disorder" column has missing values which represent individuals without any disorder. 
# We'll fill these with "None".
df['Sleep Disorder'] = df['Sleep Disorder'].fillna('None')

# Drop "Person ID" as it's an identifier, not a predictive feature
df = df.drop('Person ID', axis=1)

# Clean up redundant categories (e.g. "Normal Weight" and "Normal" are the same)
df['BMI Category'] = df['BMI Category'].replace('Normal Weight', 'Normal')

# Blood pressure is given as a string (e.g., "126/83"). 
# We need to split this into two numerical columns: Systolic and Diastolic.
df[['Systolic', 'Diastolic']] = df['Blood Pressure'].str.split('/', expand=True).astype(int)
df = df.drop('Blood Pressure', axis=1) # Drop the original string column

# Separate features (X) and target (y)
X = df.drop('Sleep Disorder', axis=1)
y = df['Sleep Disorder']

# Encode the target variable (Sleep Disorder -> numbers)
# We use LabelEncoder so we can easily map predictions back to their original names later.
le_y = LabelEncoder()
y_encoded = le_y.fit_transform(y)

# 4. Encode categorical features if needed
categorical_features = ['Gender', 'Occupation', 'BMI Category']
numeric_features = ['Age', 'Sleep Duration', 'Quality of Sleep', 'Physical Activity Level', 'Stress Level', 'Heart Rate', 'Daily Steps', 'Systolic', 'Diastolic']

# Create a preprocessing pipeline:
# - StandardScaler scales numerical features to have mean=0 and variance=1.
# - OneHotEncoder converts categorical text features into binary dummy columns.
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Create the full modeling pipeline
# 6. Train suitable machine learning models
# Since the target variable is categorical (None, Insomnia, Sleep Apnea), we use RandomForestClassifier.
model = Pipeline(steps=[('preprocessor', preprocessor),
                        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))])

# 5. Split the dataset into train and test sets (80/20)
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train the model
model.fit(X_train, y_train)

# 7. Evaluate the model using appropriate metrics
y_pred = model.predict(X_test)

print("--- Model Evaluation Metrics ---")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision (weighted):", precision_score(y_test, y_pred, average='weighted'))
print("Recall (weighted):", recall_score(y_test, y_pred, average='weighted'))
print("F1 Score (weighted):", f1_score(y_test, y_pred, average='weighted'))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# 8. Display feature importance
# First, extract the generated feature names from the OneHotEncoder
cat_encoder = model.named_steps['preprocessor'].named_transformers_['cat']
cat_feature_names = cat_encoder.get_feature_names_out(categorical_features)
# Combine with numerical feature names
all_feature_names = numeric_features + list(cat_feature_names)

# Extract importances from the RandomForestClassifier
importances = model.named_steps['classifier'].feature_importances_
feature_importance_df = pd.DataFrame({'Feature': all_feature_names, 'Importance': importances})
feature_importance_df = feature_importance_df.sort_values(by='Importance', ascending=False)

print("\n--- Feature Importances ---")
print(feature_importance_df.head(15).to_string(index=False))

# 9. Save the best trained model as a .pkl file using joblib
# We save a dictionary containing both the trained pipeline and the target label encoder 
# so we can decode predictions easily in the predict script.
# 11. Removing synthetic data: We overwrite the existing model file to replace synthetic results.
joblib.dump({'model': model, 'target_encoder': le_y}, 'vitacore_model.pkl')
print("\nModel saved successfully as vitacore_model.pkl")