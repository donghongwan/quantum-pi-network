import argparse
import logging
import os
from src.data_preprocessing import preprocess_data
from src.models.ai_model import train_model, load_model, evaluate_model
from src.prediction import make_prediction
from src.smart_contract import adjust_supply

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main(action):
    try:
        # Step 1: Load and preprocess data
        X_train, X_test, y_train, y_test = preprocess_data('data/market_data_cache.csv')
        logging.info("Data loaded and preprocessed successfully.")

        if action == 'train':
            # Step 2: Train the model
            model, history = train_model(X_train, y_train, X_test, y_test)
            # Save the trained model
            model.save('models/ai_model.h5')  # For TensorFlow
            logging.info("Model trained and saved successfully.")

            # Step 3: Evaluate the model
            mse, r2 = evaluate_model(model, X_test, y_test)
            logging.info(f"Model evaluation completed: MSE = {mse}, R^2 = {r2}")

        elif action == 'predict':
            # Load the trained model
            if not os.path.exists('models/ai_model.h5'):
                logging.error("Model file not found. Please train the model first.")
                return
            
            model = load_model('models/ai_model.h5')  # For TensorFlow
            logging.info("Model loaded successfully.")

            # Step 4: Make predictions
            predictions = make_prediction(model, X_test)
            logging.info("Predictions made successfully.")

            # Step 5: Adjust token supply based on predictions
            adjust_supply(predictions)
            logging.info("Token supply adjusted based on predictions.")

    except FileNotFoundError as fnf_error:
        logging.error(f"File not found: {fnf_error}")
    except ValueError as val_error:
        logging.error(f"Value error: {val_error}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        raise  # Re-raise the exception for further handling if needed

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='AI-Driven Dynamic Pegging Mechanism')
    parser.add_argument('--action', type=str, choices=['train', 'predict'], required=True,
                        help='Specify whether to train the model or make predictions.')
    args = parser.parse_args()
    
    main(args.action)
