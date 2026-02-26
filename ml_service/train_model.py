import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import joblib

# 1. Load the dataset
df = pd.read_csv('MENSTRUAL.csv')

# 2. Drop irrelevant columns
df = df.drop(columns=['Name', 'MONTH'])

# --- DATA CLEANING (Fixing issues from the CSV) ---

# Fix Age: Remove the "+" sign from "20+" and convert the column to numbers
df['AGE'] = df['AGE'].astype(str).str.replace('+', '', regex=False)
df['AGE'] = pd.to_numeric(df['AGE'], errors='coerce')

# Fix Menstrual Cycle: Convert "NORMAL CYCLE" to 1 and "MISSED CYCLE" to 0
cycle_map = {'NORMAL CYCLE': 1, 'MISSED CYCLE': 0}
df['MENSTRUAL CYCLE'] = df['MENSTRUAL CYCLE'].astype(str).str.strip().str.upper().map(cycle_map)

# 3. Calculate Period Duration from Dates (Coerce handles blank dates safely)
df['START DATE'] = pd.to_datetime(df['START DATE'], errors='coerce')
df['END DATE'] = pd.to_datetime(df['END DATE'], errors='coerce')
df['PERIOD_DURATION'] = (df['END DATE'] - df['START DATE']).dt.days

# Drop the original date columns
df = df.drop(columns=['START DATE', 'END DATE'])

# 4. Encode Categorical Data
le_maternal = LabelEncoder()
df['METERNAL STATUS'] = le_maternal.fit_transform(df['METERNAL STATUS'].astype(str))

# Fix Formatting: Make everything Title Case (e.g., "HIGH" becomes "High")
df['BLOOD FLOW'] = df['BLOOD FLOW'].astype(str).str.strip().str.title()
df['PAIN LEVEL'] = df['PAIN LEVEL'].astype(str).str.strip().str.title()

# Map ordinal data to numbers (Matching the exact words in your CSV)
flow_map = {'Light': 1, 'Low': 1, 'Normal': 2, 'Medium': 2, 'Heavy': 3, 'High': 3}
pain_map = {'Low': 1, 'Medium': 2, 'High': 3, 'Severe': 4}

df['BLOOD FLOW'] = df['BLOOD FLOW'].map(flow_map)
df['PAIN LEVEL'] = df['PAIN LEVEL'].map(pain_map)

# Handle Symptoms (Count number of symptoms, ignoring "NONE")
def count_symptoms(x):
    if pd.isnull(x) or str(x).strip().upper() == 'NONE':
        return 0
    return len(str(x).split(','))

df['SYMPTOM_COUNT'] = df['SYMPTOMS'].apply(count_symptoms)
df = df.drop(columns=['SYMPTOMS'])

# Fill any remaining missing values with the median of the column
df = df.fillna(df.median(numeric_only=True))

# 5. Define Features (X) and Target (y)
X = df[['AGE', 'MENSTRUAL CYCLE', 'METERNAL STATUS', 'PERIOD_DURATION', 'BLOOD FLOW', 'PAIN LEVEL', 'SYMPTOM_COUNT']]

# Fill any blank diseases with 'None'
y = df['Any disease'].fillna('None')

# 6. Split data (Using standard split instead of stratify for small custom datasets)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7. Train the Model
model = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)

# 8. Evaluate Accuracy
predictions = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, predictions) * 100:.2f}%")
print("\nDetailed Report:\n", classification_report(y_test, predictions, zero_division=0))

# 9. Save the Model
joblib.dump(model, 'lunaflow_model.pkl')
print("\n✅ Model trained and saved successfully as lunaflow_model.pkl!")