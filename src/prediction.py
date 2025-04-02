# src/prediction.py

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.externals import joblib  # Use joblib for loading the scaler
from src.model import load_model
import logging
from typing import Any, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def preprocess_input(input_data: pd.DataFrame, scaler: StandardScaler) -> np.ndarray:
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
    
    logger.info("Input data preprocessed successfully.")
    return input_scaled

def make_prediction(model_path: str, scaler_path: str, input_data: pd.DataFrame) -> np.ndarray:
    """
    Make predictions using the trained model.

    Parameters:
    - model_path: str, path to the trained model file.
    - scaler_path: str, path to the saved scaler file.
    - input_data: DataFrame, raw input data for prediction.

    Returns:
    - predictions: ndarray, predicted values.
    """
    try:
        # Load the trained model
        model = load_model(model_path)

        # Load the scaler
        scaler = joblib.load(scaler_path)

        # Preprocess the input data
        input_scaled = preprocess_input(input_data, scaler)

        # Make predictions
        predictions = model.predict(input_scaled)
        
        logger.info("Predictions made successfully.")
        return predictions
    except Exception as e:
        logger.error(f"Error making predictions: {e}")
        raise

def adjust_supply(predictions: np.ndarray) -> None:
    """
    Adjust the token supply based on predictions.

    Parameters:
    - predictions: ndarray, predicted values for the price of Pi Coin.
    """
    try:
        # Example logic for adjusting supply based on predictions
        for predicted_price in predictions:
            if predicted_price < 314159:  # Example threshold
                logger.info(f"Adjusting supply: Decrease supply as predicted price is {predicted_price:.2f}")
                # Implement logic to decrease supply
            elif predicted_price > 314159:
                logger.info(f"Adjusting supply: Increase supply as predicted price is {predicted_price:.2f}")
                # Implement logic to increase supply
            else:
                logger.info(f"Predicted price is stable at {predicted_price:.2f}, no adjustment needed.")
    except Exception as e:
        logger.error(f"Error adjusting supply: {e}")
        raise
