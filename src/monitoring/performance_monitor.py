import logging
import numpy as np
import matplotlib.pyplot as plt
from collections import deque

class PerformanceMonitor:
    """Monitors the performance of nodes in the Quantum-Pi Network."""

    def __init__(self, network_manager, history_size=10):
        self.network_manager = network_manager
        self.history_size = history_size
        self.performance_history = {node.node_id: deque(maxlen=history_size) for node in network_manager.nodes}

    def collect_performance_data(self):
        """Collect performance data from all nodes."""
        performance_data = []
        for node in self.network_manager.nodes:
            if node.is_active:
                performance = node.monitor_performance()
                self.performance_history[node.node_id].append(performance)
                performance_data.append({
                    "node_id": node.node_id,
                    "performance": performance
                })
            else:
                performance_data.append({
                    "node_id": node.node_id,
                    "performance": 0.0  # Inactive nodes have no performance
                })
        logging.info(f"Collected performance data: {performance_data}")
        return performance_data

    def analyze_performance(self, performance_data):
        """Analyze the collected performance data."""
        performances = [data['performance'] for data in performance_data]
        mean_performance = np.mean(performances)
        std_dev_performance = np.std(performances)

        logging.info(f"Performance Analysis: Mean = {mean_performance:.2f}, Std Dev = {std_dev_performance:.2f}")

        # Thresholds for alerts
        if std_dev_performance > 0.1:
            logging.warning("Performance is unstable across nodes.")
        if mean_performance < 0.5:
            logging.error("Average performance is below acceptable levels.")
            self.trigger_self_healing(performance_data)

        return {
            "mean_performance": mean_performance,
            "std_dev_performance": std_dev_performance
        }

    def trigger_self_healing(self, performance_data):
        """Trigger self-healing mechanisms based on performance metrics."""
        for data in performance_data:
            if data['performance'] < 0.5:  # Threshold for triggering self-healing
                node_id = data['node_id']
                logging.info(f"Triggering self-healing for Node {node_id} due to low performance.")
                node = self.network_manager.nodes[node_id]
                node.simulate_failure()  # Simulate failure to trigger repair
                self.network_manager.self_healing_mechanism.repair_node(node)

    def visualize_performance(self):
        """Visualize the performance history of all nodes."""
        plt.figure(figsize=(10, 5))
        for node_id, history in self.performance_history.items():
            plt.plot(history, label=f'Node {node_id}')
        plt.title('Node Performance History')
        plt.xlabel('Time')
        plt.ylabel('Performance')
        plt.legend()
        plt.grid()
        plt.show()

    def __str__(self):
        return "PerformanceMonitor for Quantum-Pi Network"

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    from network.network_manager import NetworkManager

    # Initialize network manager
    network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
    network_manager.initialize_network()

    # Initialize performance monitor
    performance_monitor = PerformanceMonitor(network_manager)

    # Simulate monitoring
    for _ in range(5):
        performance_data = performance_monitor.collect_performance_data()
        performance_monitor.analyze_performance(performance_data)

    # Visualize performance
    performance_monitor.visualize_performance()
