# src/prediction.py

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from src.model import load_model

def preprocess_input(input_data, scaler):
    """
    Preprocess the input data for prediction.

    Parameters:
    - input_data: DataFrame, raw input data for prediction.
    - scaler: StandardScaler instance, used for scaling features.

    Returns:
    - input_scaled: ndarray, scaled input features.
    """
    # Handle missing values (if any)
    input_data.fillna(input_data.mean(), inplace=True)

    # Convert categorical variables to dummy variables
    input_data = pd.get_dummies(input_data, drop_first=True)

    # Scale the features
    input_scaled = scaler.transform(input_data)
    
    return input_scaled

def make_prediction(model_path, input_data):
    """
    Make predictions using the trained model.

    Parameters:
    - model_path: str, path to the trained model file.
    - input_data: DataFrame, raw input data for prediction.

    Returns:
    - predictions: ndarray, predicted values.
    """
    # Load the trained model
    model = load_model(model_path)

    # Initialize the scaler (assuming it was saved previously)
    scaler = StandardScaler()
    # Note: In practice, you should save the scaler after training and load it here.
    # For demonstration, we will assume the scaler is already fitted on training data.

    # Preprocess the input data
    input_scaled = preprocess_input(input_data, scaler)

    # Make predictions
    predictions = model.predict(input_scaled)
    
    return predictions

def adjust_supply(predictions):
    """
    Adjust the token supply based on predictions.

    Parameters:
    - predictions: ndarray, predicted values for the price of Pi Coin.
    """
    # Example logic for adjusting supply based on predictions
    for predicted_price in predictions:
        if predicted_price < 314159:  # Example threshold
            print(f"Adjusting supply: Decrease supply as predicted price is {predicted_price[0]:.2f}")
            # Implement logic to decrease supply
        elif predicted_price > 314159:
            print(f"Adjusting supply: Increase supply as predicted price is {predicted_price[0]:.2f}")
            # Implement logic to increase supply
        else:
            print(f"Predicted price is stable at {predicted_price[0]:.2f}, no adjustment needed.")
