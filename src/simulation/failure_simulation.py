import logging
import random
import time

class FailureSimulation:
    """Simulates node failures in the Quantum-Pi Network."""

    def __init__(self, network_manager, failure_probabilities=None):
        self.network_manager = network_manager
        # Default failure probabilities for different types of failures
        self.failure_probabilities = failure_probabilities or {
            'complete': 0.1,  # 10% chance of complete failure
            'degradation': 0.2,  # 20% chance of performance degradation
            'transient': 0.1  # 10% chance of transient failure
        }

    def simulate_random_failures(self):
        """Simulate random failures across the network based on the configured probabilities."""
        for node in self.network_manager.nodes:
            failure_type = self.determine_failure_type()
            if failure_type:
                self.simulate_failure(node, failure_type)

    def determine_failure_type(self):
        """Determine the type of failure based on configured probabilities."""
        rand_value = random.random()
        cumulative_probability = 0.0
        for failure_type, probability in self.failure_probabilities.items():
            cumulative_probability += probability
            if rand_value < cumulative_probability:
                return failure_type
        return None

    def simulate_failure(self, node, failure_type):
        """Simulate a specific type of failure for a node."""
        if failure_type == 'complete':
            logging.error(f"Node {node.node_id} has completely failed.")
            node.simulate_failure()  # Mark the node as failed
        elif failure_type == 'degradation':
            degradation_amount = random.uniform(0.1, 0.5)  # Degrade performance by 10% to 50%
            node.performance = max(0.0, node.performance - degradation_amount)
            logging.warning(f"Node {node.node_id} performance degraded by {degradation_amount:.2f}. Current performance: {node.performance:.2f}")
        elif failure_type == 'transient':
            logging.info(f"Node {node.node_id} has experienced a transient failure.")
            # Simulate a transient failure (temporary)
            node.simulate_failure()
            time.sleep(2)  # Simulate downtime
            node.repair()  # Automatically repair after transient failure
            logging.info(f"Node {node.node_id} has recovered from transient failure.")

    def recover_node(self, node):
        """Simulate recovery of a failed node."""
        if not node.is_active:
            node.repair()  # Attempt to repair the node
            logging.info(f"Node {node.node_id} has been repaired and is now active.")

    def simulate_recovery(self):
        """Simulate recovery processes for all nodes."""
        for node in self.network_manager.nodes:
            if not node.is_active:
                self.recover_node(node)

    def report_failures(self):
        """Report the current state of the network after failures."""
        for node in self.network_manager.nodes:
            status = "Active" if node.is_active else "Failed"
            logging.info(f"Node {node.node_id}: {status}, Performance: {node.performance:.2f}")

    def __str__(self):
        return "FailureSimulation for Quantum-Pi Network"

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    from network.network_manager import NetworkManager

    # Initialize network manager
    network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
    network_manager.initialize_network()

    # Initialize failure simulation with custom probabilities
    failure_probabilities = {
        'complete': 0.1,
        'degradation': 0.3,
        'transient': 0.2
    }
    failure_simulation = FailureSimulation(network_manager, failure_probabilities)

    # Simulate random failures
    logging.info("Simulating random node failures...")
    failure_simulation.simulate_random_failures()

    # Report the state of the network after failures
    failure_simulation.report_failures()

    # Simulate recovery processes
    logging.info("Simulating recovery processes...")
    failure_simulation.simulate_recovery()

    # Report the state of the network after recovery
    failure_simulation.report_failures()
