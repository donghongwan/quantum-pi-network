import argparse
from src.data_preprocessing import preprocess_data
from src.model import train_model, load_model
from src.prediction import make_prediction
from src.smart_contract import adjust_supply

def main(action):
    # Step 1: Load and preprocess data
    data = preprocess_data('data/raw/data.csv')
    
    if action == 'train':
        # Step 2: Train the model
        model = train_model(data)
        # Save the trained model
        model.save('models/ai_model.h5')  # For TensorFlow
        # Alternatively, for PyTorch:
        # torch.save(model.state_dict(), 'models/ai_model.pth')
        print("Model trained and saved successfully.")
    
    elif action == 'predict':
        # Load the trained model
        model = load_model('models/ai_model.h5')  # For TensorFlow
        # Alternatively, for PyTorch:
        # model = YourModelClass()  # Initialize your model class
        # model.load_state_dict(torch.load('models/ai_model.pth'))
        # model.eval()

        # Step 3: Make predictions
        predictions = make_prediction(model, data)
        
        # Step 4: Adjust token supply based on predictions
        adjust_supply(predictions)
        print("Token supply adjusted based on predictions.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='AI-Driven Dynamic Pegging Mechanism')
    parser.add_argument('--action', type=str, choices=['train', 'predict'], required=True,
                        help='Specify whether to train the model or make predictions.')
    args = parser.parse_args()
    
    main(args.action)
