# src/data_preprocessing.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import logging
from typing import Tuple, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_data(file_path: str) -> pd.DataFrame:
    """
    Load the dataset from a CSV file.

    Parameters:
    - file_path: str, path to the CSV file.

    Returns:
    - DataFrame containing the loaded data.
    """
    try:
        data = pd.read_csv(file_path)
        logger.info(f"Data loaded successfully from {file_path}.")
        return data
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        raise

def clean_data(data: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the dataset by handling missing values and removing duplicates.

    Parameters:
    - data: DataFrame, the raw data.

    Returns:
    - DataFrame, the cleaned data.
    """
    # Remove duplicates
    data = data.drop_duplicates()
    logger.info("Duplicates removed.")

    # Handle missing values (fill with mean for numerical columns)
    for column in data.select_dtypes(include=[np.number]).columns:
        data[column].fillna(data[column].mean(), inplace=True)

    # Alternatively, you can drop rows with missing values
    # data.dropna(inplace=True)

    logger.info("Missing values handled.")
    return data

def preprocess_data(file_path: str) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Load and preprocess the dataset.

    Parameters:
    - file_path: str, path to the CSV file.

    Returns:
    - X: DataFrame, features for model training.
    - y: Series, target variable for model training.
    """
    # Load the data
    data = load_data(file_path)

    # Clean the data
    data = clean_data(data)

    # Separate features and target variable
    X = data.drop('price', axis=1)  # Assuming 'price' is the target variable
    y = data['price']

    # Optionally, encode categorical variables if any
    X = pd.get_dummies(X, drop_first=True)

    logger.info("Data preprocessed successfully.")
    return X, y

def scale_features(X: pd.DataFrame, method: str = 'standard') -> np.ndarray:
    """
    Scale the features using the specified scaling method.

    Parameters:
    - X: DataFrame, features to scale.
    - method: str, scaling method ('standard' or 'minmax').

    Returns:
    - X_scaled: ndarray, scaled features.
    """
    if method == 'standard':
        scaler = StandardScaler()
    elif method == 'minmax':
        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()
    else:
        logger.error("Invalid scaling method specified.")
        raise ValueError("Invalid scaling method. Choose 'standard' or 'minmax'.")

    X_scaled = scaler.fit_transform(X)
    logger.info(f"Features scaled using {method} scaling.")
    return X_scaled

def split_data(X: pd.DataFrame, y: pd.Series, test_size: float = 0.2, random_state: int = 42) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Split the dataset into training and testing sets.

    Parameters:
    - X: DataFrame, features.
    - y: Series, target variable.
    - test_size: float, proportion of the dataset to include in the test split.
    - random_state: int, random seed for reproducibility.

    Returns:
    - X_train, X_test, y_train, y_test: Split datasets.
    """
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)
    logger.info("Data split into training and testing sets.")
    return X_train, X_test, y_train, y_test
