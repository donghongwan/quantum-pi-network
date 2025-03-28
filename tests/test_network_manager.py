import unittest
from unittest.mock import patch
from network.network_manager import NetworkManager

class TestNetworkManager(unittest.TestCase):
    """Unit tests for the NetworkManager class."""

    def setUp(self):
        """Set up a NetworkManager instance for testing."""
        self.network_manager = NetworkManager(num_nodes=5, redundancy_level=2)
        self.network_manager.initialize_network()

    def test_initialization(self):
        """Test the initialization of the NetworkManager."""
        self.assertEqual(len(self.network_manager.nodes), 5)
        self.assertEqual(self.network_manager.redundancy_level, 2)

    def test_monitor_network(self):
        """Test the network monitoring functionality."""
        self.network_manager.monitor_network()  # Should not raise any exceptions

    @patch('network.network_manager.random.random')
    def test_simulate_node_failure(self, mock_random):
        """Test the simulation of node failures."""
        mock_random.return_value = 0.1  # Simulate a failure
        self.network_manager.simulate_node_failure(0)
        self.assertFalse(self.network_manager.nodes[0].is_active)

    def test_handle_failure(self):
        """Test the handling of node failures."""
        self.network_manager.simulate_node_failure(0)
        self.network_manager.handle_failure(0)
        self.assertTrue(self.network_manager.nodes[1].is_active)  # Check if a redundant node is activated

    def test_get_network_status(self):
        """Test the retrieval of network status."""
        status = self.network_manager.get_network_status()
        self.assertEqual(len(status), 5)

    @patch('network.network_manager.Node.communicate')
    def test_communicate_between_nodes(self, mock_communicate):
        """Test communication between nodes."""
        mock_communicate.return_value = "Message received"
        self.network_manager.communicate_between_nodes("Hello, Nodes!")
        mock_communicate.assert_called()

if __name__ == '__main__':
    unittest.main()
