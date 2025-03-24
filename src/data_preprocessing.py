# src/data_preprocessing.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def load_data(file_path):
    """
    Load the dataset from a CSV file.

    Parameters:
    - file_path: str, path to the CSV file.

    Returns:
    - DataFrame containing the loaded data.
    """
    data = pd.read_csv(file_path)
    return data

def clean_data(data):
    """
    Clean the dataset by handling missing values and removing duplicates.

    Parameters:
    - data: DataFrame, the raw data.

    Returns:
    - DataFrame, the cleaned data.
    """
    # Remove duplicates
    data = data.drop_duplicates()

    # Handle missing values (example: fill with mean for numerical columns)
    for column in data.select_dtypes(include=[np.number]).columns:
        data[column].fillna(data[column].mean(), inplace=True)

    # Alternatively, you can drop rows with missing values
    # data.dropna(inplace=True)

    return data

def preprocess_data(file_path):
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

    return X, y

def scale_features(X):
    """
    Scale the features using StandardScaler.

    Parameters:
    - X: DataFrame, features to scale.

    Returns:
    - X_scaled: ndarray, scaled features.
    """
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    return X_scaled

def split_data(X, y, test_size=0.2, random_state=42):
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
    return train_test_split(X, y, test_size=test_size, random_state=random_state)
