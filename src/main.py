import time
import random
from network.network_manager import NetworkManager
from monitoring.performance_monitor import PerformanceMonitor
from monitoring.anomaly_detection import AnomalyDetector
from network.self_healing import SelfHealingMechanism

def main():
    # Configuration settings
    NUM_NODES = 10
    MONITOR_INTERVAL = 5  # seconds

    # Initialize components
    network_manager = NetworkManager(num_nodes=NUM_NODES)
    performance_monitor = PerformanceMonitor(network_manager)
    anomaly_detector = AnomalyDetector()
    self_healing_mechanism = SelfHealingMechanism(network_manager)

    # Start the network
    print("Starting the Quantum-Pi Network...")
    network_manager.initialize_network()

    try:
        while True:
            # Monitor performance of nodes
            performance_data = performance_monitor.collect_performance_data()
            print(f"Performance Data: {performance_data}")

            # Check for anomalies
            anomalies = anomaly_detector.detect_anomalies(performance_data)
            if anomalies:
                print(f"Anomalies detected in nodes: {anomalies}")
                # Trigger self-healing mechanism
                self_healing_mechanism.repair_nodes(anomalies)

            # Simulate random node failures for testing
            if random.random() < 0.1:  # 10% chance of failure
                failed_node = random.randint(0, NUM_NODES - 1)
                print(f"Simulating failure in node {failed_node}")
                network_manager.simulate_node_failure(failed_node)

            time.sleep(MONITOR_INTERVAL)

    except KeyboardInterrupt:
        print("Shutting down the Quantum-Pi Network...")
    finally:
        network_manager.shutdown_network()

if __name__ == "__main__":
    main()
