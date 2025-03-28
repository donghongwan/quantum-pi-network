import os
import json
import logging

class Config:
    """Configuration settings for the Quantum-Pi Network."""

    # Default configuration settings
    DEFAULTS = {
        "NUM_NODES": 10,  # Total number of nodes in the network
        "NODE_FAILURE_THRESHOLD": 0.8,  # Threshold for node performance (0-1)
        "REDUNDANCY_LEVEL": 2,  # Number of redundant nodes for each primary node
        "MONITOR_INTERVAL": 5,  # Interval for monitoring node performance (in seconds)
        "ANOMALY_DETECTION_THRESHOLD": 0.7,  # Threshold for detecting anomalies (0-1)
        "LOGGING_ENABLED": True,  # Enable or disable logging
        "LOGGING_LEVEL": 'DEBUG',  # Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL
        "LOGGING_FORMAT": '%(asctime)s - %(levelname)s - %(message)s',  # Log message format
        "LOGGING_FILE": os.path.join(os.path.dirname(__file__), 'quantum_pi_network.log'),  # Log file path
        "QUANTUM_SIMULATION_ENABLED": True,  # Enable or disable quantum simulations
        "SIMULATION_RUNS": 1000,  # Number of runs for quantum simulations
        "SIMULATION_TIMEOUT": 30,  # Timeout for each simulation run (in seconds)
        "SELF_HEALING_ENABLED": True,  # Enable or disable self-healing mechanism
        "REPAIR_ATTEMPTS": 3  # Number of attempts to repair a failed node
    }

    CONFIG = {}

    @classmethod
    def load_config(cls, config_file='config.json'):
        """Load configuration from a JSON file and override with environment variables."""
        try:
            with open(config_file, 'r') as file:
                cls.CONFIG = json.load(file)
                logging.info(f"Loaded configuration from {config_file}")
        except FileNotFoundError:
            logging.warning(f"Configuration file {config_file} not found. Using default settings.")
            cls.CONFIG = cls.DEFAULTS
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON from {config_file}: {e}")
            cls.CONFIG = cls.DEFAULTS

        # Override with environment variables
        cls.override_with_env()

    @classmethod
    def override_with_env(cls):
        """Override configuration settings with environment variables."""
        for key in cls.DEFAULTS.keys():
            env_value = os.getenv(key)
            if env_value is not None:
                if key in ["NUM_NODES", "REDUNDANCY_LEVEL", "SIMULATION_RUNS", "SIMULATION_TIMEOUT", "REPAIR_ATTEMPTS"]:
                    cls.CONFIG[key] = int(env_value)
                elif key in ["NODE_FAILURE_THRESHOLD", "ANOMALY_DETECTION_THRESHOLD"]:
                    cls.CONFIG[key] = float(env_value)
                elif key in ["LOGGING_ENABLED"]:
                    cls.CONFIG[key] = env_value.lower() in ['true', '1', 't']
                else:
                    cls.CONFIG[key] = env_value
                logging.info(f"Overridden {key} with environment variable value: {cls.CONFIG[key]}")

    @staticmethod
    def display_config():
        """Display the current configuration settings."""
        print("Current Configuration Settings:")
        for key, value in Config.CONFIG.items():
            print(f"{key}: {value}")

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    Config.load_config()  # Load configuration settings
    Config.display_config()  # Display the loaded configuration
