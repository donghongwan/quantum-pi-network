# src/utils.py

import logging
import os
import json

def setup_logging(log_file='app.log', level=logging.INFO):
    """
    Set up logging configuration.

    Parameters:
    - log_file: str, the name of the log file.
    - level: logging level, default is INFO.
    """
    logging.basicConfig(
        filename=log_file,
        filemode='a',  # Append mode
        format='%(asctime)s - %(levelname)s - %(message)s',
        level=level
    )
    logging.info("Logging is set up.")

def load_config(config_file='config.json'):
    """
    Load configuration from a JSON file.

    Parameters:
    - config_file: str, path to the configuration file.

    Returns:
    - config: dict, configuration settings.
    """
    if not os.path.exists(config_file):
        logging.error(f"Configuration file {config_file} not found.")
        raise FileNotFoundError(f"Configuration file {config_file} not found.")
    
    with open(config_file, 'r') as f:
        config = json.load(f)
    
    logging.info("Configuration loaded successfully.")
    return config

def save_model_metrics(metrics, file_path='model_metrics.json'):
    """
    Save model metrics to a JSON file.

    Parameters:
    - metrics: dict, metrics to save.
    - file_path: str, path to the metrics file.
    """
    with open(file_path, 'w') as f:
        json.dump(metrics, f)
    logging.info(f"Model metrics saved to {file_path}.")

def load_model_metrics(file_path='model_metrics.json'):
    """
    Load model metrics from a JSON file.

    Parameters:
    - file_path: str, path to the metrics file.

    Returns:
    - metrics: dict, loaded metrics.
    """
    if not os.path.exists(file_path):
        logging.error(f"Metrics file {file_path} not found.")
        raise FileNotFoundError(f"Metrics file {file_path} not found.")
    
    with open(file_path, 'r') as f:
        metrics = json.load(f)
    
    logging.info("Model metrics loaded successfully.")
    return metrics

def print_metrics(metrics):
    """
    Print model metrics to the console.

    Parameters:
    - metrics: dict, metrics to print.
    """
    for key, value in metrics.items():
        print(f"{key}: {value}")
