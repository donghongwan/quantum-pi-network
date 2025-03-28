import unittest
from unittest.mock import patch
from network.self_healing import SelfHealingMechanism
from network.network_manager import NetworkManager

class TestSelfHealingMechanism(unittest.TestCase):
    """Unit tests for the SelfHealingMechanism class."""

    def setUp(self):
        """Set up a SelfHealingMechanism instance for testing."""
        self.network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
        self.network_manager.initialize_network()
        self.self_healing = SelfHealingMechanism(self.network_manager)

    def test_monitor_and_repair(self):
        """Test the monitoring and repair functionality."""
        self.network_manager.simulate_node_failure(0)
        self.self_healing.monitor_and_repair()  # Should not raise any exceptions

    @patch('network.self_healing.random.random')
    def test_trigger_self_healing(self, mock_random):
        """Test the triggering of self-healing mechanisms."""
        mock_random.return_value = 0.1  # Simulate an anomaly
        anomalies = [{'node_id': 0}]
        self.self_healing.trigger_self_healing(anomalies)
        self.assertTrue(self.network_manager.nodes[0].is_active)  # Check if the node is repaired

if __name__ == '__main__':
    unittest.main()
