import pandas as pd
import numpy as np
import logging
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_data(filename='data/market_data_cache.csv'):
    """Load market data from a CSV file."""
    try:
        data = pd.read_csv(filename)
        logging.info("Data loaded successfully.")
        return data
    except FileNotFoundError:
        logging.error("Data file not found.")
        return pd.DataFrame()  # Return an empty DataFrame if the file does not exist

def clean_data(data):
    """Clean the data by handling missing values and duplicates."""
    initial_shape = data.shape
    data.drop_duplicates(inplace=True)  # Remove duplicate rows
    data.fillna(method='ffill', inplace=True)  # Forward fill missing values
    logging.info(f"Data cleaned: {initial_shape} -> {data.shape}")
    return data

def feature_engineering(data):
    """Create additional features for the model."""
    # Example: Create a 'price_change' feature
    data['price_change'] = data['pi-network'].pct_change()  # Percentage change in price
    data['price_change'].fillna(0, inplace=True)  # Fill NaN values with 0
    logging.info("Feature engineering completed.")
    return data

def normalize_data(data):
    """Normalize the data using Min-Max scaling."""
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)
    logging.info("Data normalization completed.")
    return pd.DataFrame(scaled_data, columns=data.columns)

def split_data(data, target_column='pi-network'):
    """Split the data into training and testing sets."""
    X = data.drop(columns=[target_column])
    y = data[target_column]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    logging.info("Data split into training and testing sets.")
    return X_train, X_test, y_train, y_test

def preprocess_data(filename='data/market_data_cache.csv'):
    """Main function to preprocess the market data."""
    data = load_data(filename)
    if data.empty:
        return None, None, None, None  # Return None if data is empty

    data = clean_data(data)
    data = feature_engineering(data)
    data = normalize_data(data)
    X_train, X_test, y_train, y_test = split_data(data)

    return X_train, X_test, y_train, y_test

if __name__ == "__main__":
    X_train, X_test, y_train, y_test = preprocess_data()
    if X_train is not None:
        logging.info("Preprocessing completed successfully.")
