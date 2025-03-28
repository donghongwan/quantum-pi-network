import time
import random
import logging
import json
from network.network_manager import NetworkManager
from monitoring.performance_monitor import PerformanceMonitor
from monitoring.anomaly_detection import AnomalyDetector
from network.self_healing import SelfHealingMechanism
from config import Config

# Configure logging
logging.basicConfig(
    filename=Config.LOGGING_FILE,
    level=Config.LOGGING_LEVEL,
    format=Config.LOGGING_FORMAT
)

def load_configuration():
    """Load configuration from a JSON file."""
    try:
        with open('config.json', 'r') as config_file:
            config_data = json.load(config_file)
            return config_data
    except Exception as e:
        logging.error(f"Error loading configuration: {e}")
        return None

def main():
    # Load configuration settings
    config_data = load_configuration()
    if config_data:
        NUM_NODES = config_data.get("NUM_NODES", 10)
        MONITOR_INTERVAL = config_data.get("MONITOR_INTERVAL", 5)
    else:
        NUM_NODES = 10
        MONITOR_INTERVAL = 5

    # Initialize components
    network_manager = NetworkManager(num_nodes=NUM_NODES)
    performance_monitor = PerformanceMonitor(network_manager)
    anomaly_detector = AnomalyDetector()
    self_healing_mechanism = SelfHealingMechanism(network_manager)

    # Start the network
    logging.info("Starting the Quantum-Pi Network...")
    network_manager.initialize_network()

    try:
        while True:
            # Monitor performance of nodes
            performance_data = performance_monitor.collect_performance_data()
            logging.info(f"Performance Data: {performance_data}")

            # Check for anomalies
            anomalies = anomaly_detector.detect_anomalies(performance_data)
            if anomalies:
                logging.warning(f"Anomalies detected in nodes: {anomalies}")
                # Trigger self-healing mechanism
                self_healing_mechanism.repair_nodes(anomalies)

            # Simulate random node failures for testing
            if random.random() < 0.1:  # 10% chance of failure
                failed_node = random.randint(0, NUM_NODES - 1)
                logging.error(f"Simulating failure in node {failed_node}")
                network_manager.simulate_node_failure(failed_node)

            time.sleep(MONITOR_INTERVAL)

    except KeyboardInterrupt:
        logging.info("Shutting down the Quantum-Pi Network...")
    finally:
        network_manager.shutdown_network()
        logging.info("Network shutdown complete.")

if __name__ == "__main__":
    main()
