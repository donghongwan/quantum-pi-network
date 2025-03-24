# src/model.py

import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.metrics import mean_squared_error

def build_model(input_shape):
    """
    Build a neural network model.

    Parameters:
    - input_shape: int, the number of input features.

    Returns:
    - model: Keras model instance.
    """
    model = keras.Sequential([
        keras.layers.Dense(128, activation='relu', input_shape=(input_shape,)),
        keras.layers.Dropout(0.2),  # Dropout layer for regularization
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dense(1)  # Output layer for regression
    ])

    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])
    return model

def train_model(X_train, y_train, X_val, y_val, epochs=100, batch_size=32):
    """
    Train the neural network model.

    Parameters:
    - X_train: ndarray, training features.
    - y_train: ndarray, training target variable.
    - X_val: ndarray, validation features.
    - y_val: ndarray, validation target variable.
    - epochs: int, number of epochs to train.
    - batch_size: int, size of the batches.

    Returns:
    - history: History object containing training metrics.
    """
    model = build_model(X_train.shape[1])
    
    # Train the model
    history = model.fit(X_train, y_train, 
                        validation_data=(X_val, y_val),
                        epochs=epochs, 
                        batch_size=batch_size, 
                        verbose=1)
    
    return model, history

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the model on the test set.

    Parameters:
    - model: Keras model instance.
    - X_test: ndarray, test features.
    - y_test: ndarray, test target variable.

    Returns:
    - mse: float, mean squared error on the test set.
    - mae: float, mean absolute error on the test set.
    """
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    mae = np.mean(np.abs(y_test - y_pred))
    
    return mse, mae

def save_model(model, file_path):
    """
    Save the trained model to a file.

    Parameters:
    - model: Keras model instance.
    - file_path: str, path to save the model.
    """
    model.save(file_path)

def load_model(file_path):
    """
    Load a trained model from a file.

    Parameters:
    - file_path: str, path to the model file.

    Returns:
    - model: Keras model instance.
    """
    return keras.models.load_model(file_path)
