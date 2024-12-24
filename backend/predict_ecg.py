import sys
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model

def preprocess_ecg(data):
    # Dummy preprocessing, adjust the shape according to your model's requirements
    return data.values.reshape(-1, 10, data.shape[1])  # Modify as necessary

def load_and_predict(file_path):
    model = load_model("C:\\Users\\VINEELA\\Documents\\stress_model.h5")  # Adjust the path as necessary
    data = pd.read_csv(file_path)
    sequences = preprocess_ecg(data)

    prediction = model.predict(sequences)
    mean_prediction = np.mean(prediction)
    return "Stressed" if mean_prediction > 0.5 else "Not Stressed"

if __name__ == "__main__":
    file_path = sys.argv[1]
    result = load_and_predict(file_path)
    print(result)
    
    
    
    

