import random
import logging
import time
import json
import numpy as np

class Node:
    """Represents a node in the Quantum-Pi Network."""

    def __init__(self, node_id, redundancy_level=2):
        self.node_id = node_id
        self.performance = 1.0  # Performance metric (1.0 = 100% performance)
        self.is_active = True
        self.redundancy_level = redundancy_level
        self.failure_count = 0
        self.history = []  # Store performance history for analysis

    def monitor_performance(self):
        """Simulate performance monitoring for the node."""
        if not self.is_active:
            return 0.0  # Inactive nodes have no performance

        # Simulate random performance degradation
        degradation = random.uniform(0.0, 0.1)
        self.performance = max(0.0, self.performance - degradation)
        self.history.append(self.performance)
        logging.info(f"Node {self.node_id} performance monitored: {self.performance:.2f}")
        return self.performance

    def simulate_failure(self):
        """Simulate a failure in the node."""
        self.is_active = False
        self.failure_count += 1
        logging.error(f"Node {self.node_id} has failed. Total failures: {self.failure_count}")

    def repair(self):
        """Repair the node and restore its performance."""
        if not self.is_active:
            self.is_active = True
            self.performance = 1.0  # Reset performance to 100%
            logging.info(f"Node {self.node_id} has been repaired and is now active.")

    def get_status(self):
        """Return the current status of the node."""
        return {
            "node_id": self.node_id,
            "is_active": self.is_active,
            "performance": self.performance,
            "failure_count": self.failure_count,
            "performance_history": self.history
        }

    def communicate(self, message):
        """Simulate communication with other nodes."""
        if self.is_active:
            logging.info(f"Node {self.node_id} sending message: {message}")
            # Simulate message processing
            time.sleep(0.1)
            return f"Message from Node {self.node_id}: {message}"
        else:
            logging.warning(f"Node {self.node_id} is inactive and cannot communicate.")
            return None

    def analyze_performance(self):
        """Analyze performance history and detect trends."""
        if len(self.history) < 2:
            return "Insufficient data for analysis."

        mean_performance = np.mean(self.history)
        std_dev_performance = np.std(self.history)
        logging.info(f"Node {self.node_id} performance analysis: Mean = {mean_performance:.2f}, Std Dev = {std_dev_performance:.2f}")

        if std_dev_performance > 0.1:
            return "Performance is unstable."
        elif mean_performance < 0.5:
            return "Performance is below acceptable levels."
        else:
            return "Performance is stable."

    def __str__(self):
        return f"Node {self.node_id}: {'Active' if self.is_active else 'Inactive'}, Performance: {self.performance:.2f}"

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    node = Node(node_id=1)
    
    # Simulate monitoring and failure
    for _ in range(10):
        node.monitor_performance()
        if random.random() < 0.2:  # 20% chance of failure
            node.simulate_failure()
        time.sleep(1)

    # Analyze performance
    analysis_result = node.analyze_performance()
    logging.info(analysis_result)

    # Repair the node
    node.repair()
    print(node)

    # Simulate communication
    response = node.communicate("Hello, Node!")
    if response:
        logging.info(response)
