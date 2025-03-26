import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import logging
import joblib

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def create_model(input_shape, dropout_rate=0.2):
    """Create a neural network model."""
    model = Sequential()
    model.add(Dense(128, activation='relu', input_shape=input_shape))
    model.add(Dropout(dropout_rate))
    model.add(Dense(64, activation='relu'))
    model.add(Dropout(dropout_rate))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(1))  # Output layer for price prediction
    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])
    logging.info("Model created successfully.")
    return model

def train_model(X_train, y_train, X_val, y_val, epochs=100, batch_size=32):
    """Train the model with early stopping."""
    model = create_model((X_train.shape[1],))
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    
    history = model.fit(X_train, y_train, 
                        validation_data=(X_val, y_val),
                        epochs=epochs, 
                        batch_size=batch_size, 
                        callbacks=[early_stopping],
                        verbose=1)
    
    logging.info("Model trained successfully.")
    return model, history

def evaluate_model(model, X_test, y_test):
    """Evaluate the model performance."""
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    logging.info(f"Model evaluation completed: MSE = {mse}, R^2 = {r2}")
    return mse, r2

def save_model(model, filename='models/ai_model.h5'):
    """Save the trained model."""
    model.save(filename)
    logging.info(f"Model saved to {filename}")

def load_model(filename='models/ai_model.h5'):
    """Load a trained model."""
    model = tf.keras.models.load_model(filename)
    logging.info(f"Model loaded from {filename}")
    return model

def hyperparameter_tuning(X_train, y_train):
    """Perform hyperparameter tuning using GridSearchCV."""
    model = tf.keras.wrappers.scikit_learn.KerasRegressor(build_fn=create_model, verbose=0)
    param_grid = {
        'batch_size': [16, 32],
        'epochs': [50, 100],
        'dropout_rate': [0.1, 0.2, 0.3]
    }
    
    grid = GridSearchCV(estimator=model, param_grid=param_grid, n_jobs=-1, cv=3)
    grid_result = grid.fit(X_train, y_train)
    
    logging.info(f"Best parameters: {grid_result.best_params_}")
    return grid_result.best_estimator_

if __name__ == "__main__":
    # Example usage
    # Load your preprocessed data here
    # X_train, X_test, y_train, y_test = load_your_data_function()

    # Train the model
    # model, history = train_model(X_train, y_train, X_val, y_val)

    # Evaluate the model
    # mse, r2 = evaluate_model(model, X_test, y_test)

    # Save the model
    # save_model(model)

    # Load the model
    # loaded_model = load_model()
