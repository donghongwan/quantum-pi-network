# src/data_preprocessing.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def load_data(file_path):
    """
    Load the dataset from a CSV file.

    Parameters:
    file_path (str): The path to the CSV file.

    Returns:
    pd.DataFrame: The loaded dataset.
    """
    data = pd.read_csv(file_path)
    return data

def handle_missing_values(data):
    """
    Handle missing values in the dataset.

    Parameters:
    data (pd.DataFrame): The input dataset.

    Returns:
    pd.DataFrame: The dataset with missing values handled.
    """
    # Example: Fill missing values with the mean of each column
    for column in data.columns:
        if data[column].isnull().any():
            data[column].fillna(data[column].mean(), inplace=True)
    return data

def feature_engineering(data):
    """
    Perform feature engineering on the dataset.

    Parameters:
    data (pd.DataFrame): The input dataset.

    Returns:
    pd.DataFrame: The dataset with engineered features.
    """
    # Example: Create new features or transform existing ones
    # Here, you can add any feature engineering logic as needed
    # For instance, creating a new feature based on existing ones
    # data['new_feature'] = data['feature1'] / data['feature2']
    
    return data

def preprocess_data(file_path):
    """
    Load and preprocess the dataset.

    Parameters:
    file_path (str): The path to the CSV file.

    Returns:
    pd.DataFrame: The preprocessed dataset.
    """
    # Load the data
    data = load_data(file_path)
    
    # Handle missing values
    data = handle_missing_values(data)
    
    # Perform feature engineering
    data = feature_engineering(data)
    
    return data

def scale_features(X_train, X_test):
    """
    Scale the features using StandardScaler.

    Parameters:
    X_train (pd.DataFrame): The training features.
    X_test (pd.DataFrame): The testing features.

    Returns:
    tuple: Scaled training and testing features.
    """
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled
