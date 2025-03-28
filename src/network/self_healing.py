import logging
import time
from network.node import Node
import numpy as np

class SelfHealingMechanism:
    """Handles self-healing logic for the Quantum-Pi Network."""

    def __init__(self, network_manager):
        self.network_manager = network_manager

    def monitor_and_repair(self):
        """Continuously monitor nodes and repair as necessary."""
        while True:
            self.check_nodes()
            time.sleep(5)  # Check every 5 seconds

    def check_nodes(self):
        """Check the status of all nodes and trigger repairs if needed."""
        for node in self.network_manager.nodes:
            if not node.is_active:
                logging.warning(f"Node {node.node_id} is inactive. Attempting repair...")
                self.repair_node(node)

    def repair_node(self, node):
        """Attempt to repair a failed node with adaptive strategies."""
        if node.failure_count < 3:  # Limit the number of repair attempts
            # Adaptive repair strategy based on performance history
            performance_analysis = self.analyze_performance(node)
            if performance_analysis == "unstable":
                logging.info(f"Node {node.node_id} is unstable. Attempting soft reset.")
                self.soft_reset(node)
            else:
                logging.info(f"Node {node.node_id} is being repaired.")
                node.repair()
            logging.info(f"Node {node.node_id} has been repaired.")
        else:
            logging.error(f"Node {node.node_id} has failed too many times and cannot be repaired.")

    def soft_reset(self, node):
        """Perform a soft reset on the node to restore functionality."""
        node.performance = 0.5  # Reset performance to a safe level
        node.is_active = True
        logging.info(f"Node {node.node_id} has undergone a soft reset.")

    def analyze_performance(self, node):
        """Analyze performance history and detect trends."""
        if len(node.history) < 2:
            return "Insufficient data for analysis."

        mean_performance = np.mean(node.history)
        std_dev_performance = np.std(node.history)
        logging.info(f"Node {node.node_id} performance analysis: Mean = {mean_performance:.2f}, Std Dev = {std_dev_performance:.2f}")

        if std_dev_performance > 0.1:
            return "unstable"
        elif mean_performance < 0.5:
            return "below acceptable levels"
        else:
            return "stable"

    def trigger_self_healing(self, anomalies):
        """Trigger self-healing mechanisms based on detected anomalies."""
        for anomaly in anomalies:
            node_id = anomaly['node_id']
            logging.info(f"Detected anomaly in Node {node_id}. Initiating repair...")
            node = self.network_manager.nodes[node_id]
            self.repair_node(node)

    def notify_admin(self, message):
        """Notify administrators of critical failures or repairs."""
        # Placeholder for notification logic (e.g., email, SMS)
        logging.critical(f"Admin Notification: {message}")

    def __str__(self):
        return "SelfHealingMechanism for Quantum-Pi Network"

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    from network.network_manager import NetworkManager

    # Initialize network manager and self-healing mechanism
    network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
    network_manager.initialize_network()
    self_healing_mechanism = SelfHealingMechanism(network_manager)

    # Simulate monitoring and self-healing
    try:
        self_healing_mechanism.monitor_and_repair()
    except KeyboardInterrupt:
        logging.info("Self-healing mechanism stopped.")
