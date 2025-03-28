import unittest
from unittest.mock import patch, MagicMock
from api.synthetic_biology import app

class TestSyntheticBiologyAPI(unittest.TestCase):
    """Unit tests for the Synthetic Biology API."""

    def setUp(self):
        """Set up the Flask test client."""
        self.app = app.test_client()
        self.app.testing = True

    @patch('api.synthetic_biology.w3')
    def test_fund_experiment_success(self, mock_w3):
        """Test successful funding of an experiment."""
        mock_w3.eth.getTransactionCount.return_value = 0
        mock_w3.eth.account.signTransaction.return_value = MagicMock(rawTransaction=b'transaction_data')
        mock_w3.eth.sendRawTransaction.return_value = b'transaction_hash'

        response = self.app.post('/fund_experiment', json={
            "user_address": "0xYourAddress",
            "amount": 0.1,
            "experiment_id": 1
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("transaction_hash", response.get_json())

    def test_fund_experiment_invalid_input(self):
        """Test funding with invalid input."""
        response = self.app.post('/fund_experiment', json={
            "user_address": "0xYourAddress",
            "amount": 0.1
            # Missing experiment_id
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())

    @patch('api.synthetic_biology.contract')
    def test_experiment_status_success(self, mock_contract):
        """Test retrieving the status of an experiment."""
        mock_contract.functions.getExperimentStatus.return_value = "Funded"

        response = self.app.get('/experiment_status/1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"experiment_id": "1", "status": "Funded"})

    @patch('api.synthetic_biology.contract')
    def test_experiment_status_not_found(self, mock_contract):
        """Test retrieving status for a non-existent experiment."""
        mock_contract.functions.getExperimentStatus.side_effect = Exception("Experiment not found")

        response = self.app.get('/experiment_status/999')
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.get_json())

if __name__ == '__main__':
    unittest.main()
