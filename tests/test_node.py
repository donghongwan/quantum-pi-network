import unittest
from unittest.mock import patch
from network.node import Node

class TestNode(unittest.TestCase):
    """Unit tests for the Node class in the Quantum-Pi Network."""

    def setUp(self):
        """Set up a Node instance for testing."""
        self.node = Node(node_id=1)

    def test_initialization(self):
        """Test the initialization of the Node."""
        self.assertEqual(self.node.node_id, 1)
        self.assertTrue(self.node.is_active)
        self.assertEqual(self.node.performance, 1.0)
        self.assertEqual(self.node.failure_count, 0)

    def test_monitor_performance(self):
        """Test performance monitoring functionality."""
        performance = self.node.monitor_performance()
        self.assertLessEqual(performance, 1.0)
        self.assertGreaterEqual(performance, 0.0)

    @patch('network.node.random.uniform')
    def test_performance_degradation(self, mock_uniform):
        """Test performance degradation."""
        mock_uniform.return_value = 0.3  # Simulate a degradation of 0.3
        initial_performance = self.node.performance
        self.node.monitor_performance()
        self.assertLess(self.node.performance, initial_performance)

    def test_simulate_failure(self):
        """Test the failure simulation functionality."""
        self.node.simulate_failure()
        self.assertFalse(self.node.is_active)
        self.assertEqual(self.node.failure_count, 1)

    def test_repair(self):
        """Test the repair functionality."""
        self.node.simulate_failure()
        self.node.repair()
        self.assertTrue(self.node.is_active)
        self.assertEqual(self.node.performance, 1.0)

    def test_get_status(self):
        """Test the status retrieval functionality."""
        status = self.node.get_status()
        self.assertEqual(status['node_id'], 1)
        self.assertTrue(status['is_active'])
        self.assertEqual(status['performance'], 1.0)
        self.assertEqual(status['failure_count'], 0)

    @patch('network.node.random.random')
    def test_communication(self, mock_random):
        """Test the communication functionality."""
        mock_random.return_value = 0.1  # Simulate an active node
        response = self.node.communicate("Hello, Node!")
        self.assertEqual(response, "Message from Node 1: Hello, Node!")

    def test_communication_inactive_node(self):
        """Test communication from an inactive node."""
        self.node.simulate_failure()
        response = self.node.communicate("Hello, Node!")
        self.assertIsNone(response)

if __name__ == '__main__':
    unittest.main()
