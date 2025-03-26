import argparse
import logging
from src.data_preprocessing import preprocess_data
from src.model import train_model, load_model
from src.prediction import make_prediction
from src.smart_contract import adjust_supply

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main(action):
    try:
        # Step 1: Load and preprocess data
        data = preprocess_data('data/raw/data.csv')
        logging.info("Data loaded and preprocessed successfully.")

        if action == 'train':
            # Step 2: Train the model
            model = train_model(data)
            # Save the trained model
            model.save('models/ai_model.h5')  # For TensorFlow
            logging.info("Model trained and saved successfully.")

        elif action == 'predict':
            # Load the trained model
            model = load_model('models/ai_model.h5')  # For TensorFlow
            logging.info("Model loaded successfully.")

            # Step 3: Make predictions
            predictions = make_prediction(model, data)
            logging.info("Predictions made successfully.")

            # Step 4: Adjust token supply based on predictions
            adjust_supply(predictions)
            logging.info("Token supply adjusted based on predictions.")

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise  # Re-raise the exception for further handling if needed

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='AI-Driven Dynamic Pegging Mechanism')
    parser.add_argument('--action', type=str, choices=['train', 'predict'], required=True,
                        help='Specify whether to train the model or make predictions.')
    args = parser.parse_args()
    
    main(args.action)
