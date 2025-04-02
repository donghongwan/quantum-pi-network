# src/utils.py

import logging
import os
import json
from typing import Any, Dict

def setup_logging(log_file: str = 'app.log', level: int = logging.INFO, log_format: str = '%(asctime)s - %(levelname)s - %(message)s') -> None:
    """
    Set up logging configuration.

    Parameters:
    - log_file: str, the name of the log file.
    - level: logging level, default is INFO.
    - log_format: str, the format of the log messages.
    """
    logging.basicConfig(
        filename=log_file,
        filemode='a',  # Append mode
        format=log_format,
        level=level
    )
    logging.info("Logging is set up.")

def load_config(config_file: str = 'config.json') -> Dict[str, Any]:
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

def save_model_metrics(metrics: Dict[str, Any], file_path: str = 'model_metrics.json') -> None:
    """
    Save model metrics to a JSON file.

    Parameters:
    - metrics: dict, metrics to save.
    - file_path: str, path to the metrics file.
    """
    try:
        with open(file_path, 'w') as f:
            json.dump(metrics, f, indent=4)  # Pretty print JSON
        logging.info(f"Model metrics saved to {file_path}.")
    except Exception as e:
        logging.error(f"Error saving model metrics: {e}")
        raise

def load_model_metrics(file_path: str = 'model_metrics.json') -> Dict[str, Any]:
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

def print_metrics(metrics: Dict[str, Any]) -> None:
    """
    Print model metrics to the console.

    Parameters:
    - metrics: dict, metrics to print.
    """
    if not metrics:
        logging.warning("No metrics to print.")
        print("No metrics available.")
        return

    for key, value in metrics.items():
        print(f"{key}: {value}")
        logging.info(f"{key}: {value}")  # Log printed metrics

def clear_log_file(log_file: str = 'app.log') -> None:
    """
    Clear the contents of the log file.

    Parameters:
    - log_file: str, the name of the log file to clear.
    """
    try:
        open(log_file, 'w').close()  # Clear the log file
        logging.info(f"Log file {log_file} cleared.")
    except Exception as e:
        logging.error(f"Error clearing log file: {e}")
        raise
