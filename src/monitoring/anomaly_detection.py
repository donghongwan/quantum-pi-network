import logging
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
import matplotlib.pyplot as plt

class AnomalyDetector:
    """Detects anomalies in node performance data."""

    def __init__(self, network_manager, algorithm='isolation_forest'):
        self.network_manager = network_manager
        self.algorithm = algorithm
        self.performance_history = {node.node_id: [] for node in network_manager.nodes}
        self.model = None

    def update_performance_history(self, performance_data):
        """Update the performance history with the latest data."""
        for data in performance_data:
            node_id = data['node_id']
            self.performance_history[node_id].append(data['performance'])

    def detect_anomalies(self):
        """Detect anomalies in the performance data of all nodes."""
        anomalies = []
        for node_id, history in self.performance_history.items():
            if len(history) < 10:  # Need enough data to make predictions
                continue

            # Prepare data for anomaly detection
            data = np.array(history).reshape(-1, 1)  # Reshape for sklearn
            self.train_model(data)
            predictions = self.model.predict(data)

            # Identify anomalies
            for i, prediction in enumerate(predictions):
                if prediction == -1:  # -1 indicates an anomaly
                    anomalies.append({
                        "node_id": node_id,
                        "anomaly_index": i,
                        "performance": history[i]
                    })
                    logging.warning(f"Anomaly detected in Node {node_id} at index {i}: {history[i]:.2f}")

        return anomalies

    def train_model(self, data):
        """Train the anomaly detection model based on the selected algorithm."""
        if self.algorithm == 'isolation_forest':
            self.model = IsolationForest(contamination=0.1)
        elif self.algorithm == 'local_outlier_factor':
            self.model = LocalOutlierFactor(n_neighbors=5)
        else:
            raise ValueError("Unsupported algorithm specified.")
        
        self.model.fit(data)

    def trigger_self_healing(self, anomalies):
        """Trigger self-healing mechanisms based on detected anomalies."""
        for anomaly in anomalies:
            node_id = anomaly['node_id']
            logging.info(f"Triggering self-healing for Node {node_id} due to detected anomaly.")
            node = self.network_manager.nodes[node_id]
            node.simulate_failure()  # Simulate failure to trigger repair
            self.network_manager.self_healing_mechanism.repair_node(node)

    def visualize_anomalies(self):
        """Visualize the performance history and detected anomalies."""
        for node_id, history in self.performance_history.items():
            plt.figure(figsize=(10, 5))
            plt.plot(history, label='Performance', marker='o')
            anomalies = [i for i, val in enumerate(history) if val < 0.5]  # Example threshold for anomalies
            plt.scatter(anomalies, [history[i] for i in anomalies], color='red', label='Anomalies', zorder=5)
            plt.title(f'Node {node_id} Performance with Anomalies')
            plt.xlabel('Time')
            plt.ylabel('Performance')
            plt.legend()
            plt.grid()
            plt.show()

    def __str__(self):
        return "AnomalyDetector for Quantum-Pi Network"

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    from network.network_manager import NetworkManager
    from monitoring.performance_monitor import PerformanceMonitor

    # Initialize network manager
    network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
    network_manager.initialize_network()

    # Initialize performance monitor and anomaly detector
    performance_monitor = PerformanceMonitor(network_manager)
    anomaly_detector = AnomalyDetector(network_manager, algorithm='isolation_forest')

    # Simulate monitoring and anomaly detection
    for _ in range(5):
        performance_data = performance_monitor.collect_performance_data()
        performance_monitor.analyze_performance(performance_data)
        anomaly_detector.update_performance_history(performance_data)
        anomalies = anomaly_detector.detect_anomalies()
        if anomalies:
            anomaly_detector.trigger_self_healing(anomalies)

    # Visualize anomalies
    anomaly_detector.visualize_anomalies()
