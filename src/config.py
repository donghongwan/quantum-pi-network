import os

class Config:
    """Configuration settings for the Quantum-Pi Network."""

    # Network parameters
    NUM_NODES = 10  # Total number of nodes in the network
    NODE_FAILURE_THRESHOLD = 0.8  # Threshold for node performance (0-1)
    REDUNDANCY_LEVEL = 2  # Number of redundant nodes for each primary node

    # Monitoring settings
    MONITOR_INTERVAL = 5  # Interval for monitoring node performance (in seconds)
    ANOMALY_DETECTION_THRESHOLD = 0.7  # Threshold for detecting anomalies (0-1)

    # Logging settings
    LOGGING_ENABLED = True  # Enable or disable logging
    LOGGING_LEVEL = 'DEBUG'  # Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL
    LOGGING_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'  # Log message format
    LOGGING_FILE = os.path.join(os.path.dirname(__file__), 'quantum_pi_network.log')  # Log file path

    # Quantum simulation parameters
    QUANTUM_SIMULATION_ENABLED = True  # Enable or disable quantum simulations
    SIMULATION_RUNS = 1000  # Number of runs for quantum simulations
    SIMULATION_TIMEOUT = 30  # Timeout for each simulation run (in seconds)

    # Self-healing parameters
    SELF_HEALING_ENABLED = True  # Enable or disable self-healing mechanism
    REPAIR_ATTEMPTS = 3  # Number of attempts to repair a failed node

    @staticmethod
    def display_config():
        """Display the current configuration settings."""
        print("Current Configuration Settings:")
        for key, value in vars(Config).items():
            if not key.startswith('__'):
                print(f"{key}: {value}")

# Example usage
if __name__ == "__main__":
    Config.display_config()
