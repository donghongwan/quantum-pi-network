import logging
import hashlib
import os
import json
import pickle
from cryptography.fernet import Fernet
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def generate_key():
    """Generate a new encryption key."""
    key = Fernet.generate_key()
    logger.info("Generated a new encryption key.")
    return key

def encrypt_data(data, key):
    """Encrypt data using the provided key."""
    fernet = Fernet(key)
    encrypted_data = fernet.encrypt(data.encode())
    logger.info("Data encrypted successfully.")
    return encrypted_data

def decrypt_data(encrypted_data, key):
    """Decrypt data using the provided key."""
    fernet = Fernet(key)
    decrypted_data = fernet.decrypt(encrypted_data).decode()
    logger.info("Data decrypted successfully.")
    return decrypted_data

def hash_password(password):
    """Hash a password using SHA-256."""
    hashed = hashlib.sha256(password.encode()).hexdigest()
    logger.info("Password hashed successfully.")
    return hashed

def load_model(model_path):
    """Load a machine learning model from a file."""
    try:
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
        logger.info(f"Model loaded from {model_path}.")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

def save_model(model, model_path):
    """Save a machine learning model to a file."""
    try:
        with open(model_path, 'wb') as file:
            pickle.dump(model, file)
        logger.info(f"Model saved to {model_path}.")
    except Exception as e:
        logger.error(f"Error saving model: {e}")
        raise

def log_transaction(transaction_id, status, user_id):
    """Log transaction details for auditing."""
    log_entry = {
        'transaction_id': transaction_id,
        'status': status,
        'user_id': user_id,
        'timestamp': datetime.utcnow().isoformat()
    }
    logger.info(f"Transaction log: {json.dumps(log_entry)}")
    # Here you could also write to a database or a file for persistent logging

def validate_transaction_data(data):
    """Validate transaction data."""
    required_fields = ['sender_id', 'receiver_id', 'amount']
    for field in required_fields:
        if field not in data:
            logger.error(f"Missing required field: {field}")
            raise ValueError(f"Missing required field: {field}")
    if data['amount'] <= 0:
        logger.error("Transaction amount must be greater than zero.")
        raise ValueError("Transaction amount must be greater than zero.")
    logger.info("Transaction data validated successfully.")

# Example usage of the utility functions
if __name__ == "__main__":
    # Generate a key for encryption
    key = generate_key()

    # Encrypt and decrypt a sample message
    sample_data = "This is a secret message."
    encrypted = encrypt_data(sample_data, key)
    decrypted = decrypt_data(encrypted, key)

    # Hash a sample password
    password = "securepassword"
    hashed_password = hash_password(password)

    # Log a transaction
    log_transaction(transaction_id=1, status="completed", user_id=123)

    # Validate transaction data
    try:
        validate_transaction_data({'sender_id': 1, 'receiver_id': 2, 'amount': 100.0})
    except ValueError as e:
        logger.error(f"Validation error: {e}")
