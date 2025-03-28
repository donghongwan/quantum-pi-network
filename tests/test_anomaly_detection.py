import unittest
from unittest.mock import patch
from monitoring.anomaly_detection import AnomalyDetector
from network.network_manager import NetworkManager

class TestAnomalyDetector(unittest.TestCase):
    """Unit tests for the AnomalyDetector class."""

    def setUp(self):
        """Set up an AnomalyDetector instance for testing."""
        self.network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
        self.network_manager.initialize_network()
        self.anomaly_detector = AnomalyDetector(self.network_manager)

    def test_update_performance_history(self):
        """Test updating performance history."""
        performance_data = [{'node_id': 0, 'performance': 0.9}]
        self.anomaly_detector.update_performance_history(performance_data)
        self.assertEqual(len(self.anomaly_detector.performance_history[0]), 1)

    @patch('network.node.random.random')
    def test_detect_anomalies(self, mock_random):
        """Test the detection of anomalies."""
        mock_random.return_value = 0.1  # Simulate a low performance
        performance_data = [{'node_id': 0, 'performance': 0.4}]
        self.anomaly_detector.update_performance_history(performance_data)
        anomalies = self.anomaly_detector.detect_anomalies()
        self.assertEqual(len(anomalies), 1)  # Expect one anomaly detected

    @patch('network.node.random.random')
    def test_trigger_self_healing(self, mock_random):
        """Test the triggering of self-healing based on detected anomalies."""
        mock_random.return_value = 0.1  # Simulate an anomaly
        anomalies = [{'node_id': 0}]
        self.anomaly_detector.trigger_self_healing(anomalies)
        self.assertTrue(self.network_manager.nodes[0].is_active)  # Check if the node is repaired

if __name__ == '__main__':
    unittest.main()
