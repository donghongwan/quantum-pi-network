import logging
from network.node import Node

class NetworkManager:
    """Manages the network and nodes in the Quantum-Pi Network."""

    def __init__(self, num_nodes=10, redundancy_level=2):
        self.num_nodes = num_nodes
        self.redundancy_level = redundancy_level
        self.nodes = [Node(node_id=i, redundancy_level=redundancy_level) for i in range(num_nodes)]
        self.active_nodes = []

    def initialize_network(self):
        """Initialize all nodes in the network."""
        for node in self.nodes:
            node.repair()  # Start all nodes as active
            self.active_nodes.append(node)
        logging.info(f"Initialized {self.num_nodes} nodes in the network.")

    def monitor_network(self):
        """Monitor the performance of all nodes in the network."""
        for node in self.nodes:
            node.monitor_performance()

    def simulate_node_failure(self, node_id):
        """Simulate a failure in a specific node."""
        if 0 <= node_id < self.num_nodes:
            self.nodes[node_id].simulate_failure()
            self.handle_failure(node_id)

    def handle_failure(self, node_id):
        """Handle the failure of a node and activate redundancy if necessary."""
        logging.info(f"Handling failure for Node {node_id}.")
        # Check for redundancy
        if self.redundancy_level > 0:
            # Activate a redundant node if available
            for i in range(self.redundancy_level):
                redundant_node_id = (node_id + i + 1) % self.num_nodes
                if not self.nodes[redundant_node_id].is_active:
                    self.nodes[redundant_node_id].repair()
                    logging.info(f"Activated redundant Node {redundant_node_id} to replace Node {node_id}.")
                    break

    def get_network_status(self):
        """Return the status of all nodes in the network."""
        status = [node.get_status() for node in self.nodes]
        return status

    def communicate_between_nodes(self, message):
        """Simulate communication between all active nodes."""
        for node in self.active_nodes:
            response = node.communicate(message)
            if response:
                logging.info(response)

    def shutdown_network(self):
        """Shutdown all nodes in the network."""
        for node in self.nodes:
            node.is_active = False
        logging.info("All nodes have been shut down.")

    def __str__(self):
        return f"NetworkManager with {self.num_nodes} nodes."

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
    network_manager.initialize_network()

    # Simulate monitoring and failures
    for _ in range(5):
        network_manager.monitor_network()
        if random.random() < 0.3:  # 30% chance of failure
            failed_node_id = random.randint(0, 4)
            network_manager.simulate_node_failure(failed_node_id)

    # Communicate between nodes
    network_manager.communicate_between_nodes("Hello, Nodes!")

    # Get network status
    status = network_manager.get_network_status()
    logging.info(f"Network Status: {status}")

    # Shutdown the network
    network_manager.shutdown_network()
