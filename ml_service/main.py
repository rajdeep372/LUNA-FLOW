from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Load the trained model
model = joblib.load('lunaflow_model.pkl')

# Define the expected input JSON structure
class PatientData(BaseModel):
    age: int
    menstrual_cycle_length: int
    maternal_status: int # e.g., 0 for Single, 1 for Married (based on your LabelEncoder)
    period_duration: int
    blood_flow: int # 1, 2, or 3
    pain_level: int # 1, 2, or 3
    symptom_count: int

@app.post("/predict_health_risk")
def predict(data: PatientData):
    # Format data for the model
    features = np.array([[
        data.age, 
        data.menstrual_cycle_length, 
        data.maternal_status,
        data.period_duration, 
        data.blood_flow, 
        data.pain_level, 
        data.symptom_count
    ]])
    
    # Predict
    prediction = model.predict(features)[0]
    
    return {
        "status": "success",
        "predicted_condition": prediction,
        "warning": "This result is based on pattern analysis for awareness purposes only. Please consult a doctor for a medical diagnosis."
    }