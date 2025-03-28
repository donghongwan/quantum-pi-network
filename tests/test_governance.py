import unittest
from unittest.mock import patch, MagicMock
from flask import json
from app import app  # Assuming your Flask app is in app.py
from governance.proposal import GovernanceProposal

class TestGovernanceAPI(unittest.TestCase):
    """Unit tests for the Governance API."""

    def setUp(self):
        """Set up the Flask test client."""
        self.app = app.test_client()
        self.app.testing = True

    @patch('governance.quantum_simulation.QuantumSimulation')
    def test_propose_success(self, mock_quantum_simulation):
        """Test successful proposal submission."""
        response = self.app.post('/propose', json={
            "proposer": "0xProposerAddress",
            "description": "Test Proposal",
            "options": ["Option A", "Option B"]
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("proposal_id", response.get_json())

    def test_propose_missing_fields(self):
        """Test proposal submission with missing fields."""
        response = self.app.post('/propose', json={
            "proposer": "0xProposerAddress",
            "description": "Test Proposal"
            # Missing options
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())

    @patch('governance.quantum_simulation.QuantumSimulation')
    def test_vote_success(self, mock_quantum_simulation):
        """Test successful voting on a proposal."""
        proposal_response = self.app.post('/propose', json={
            "proposer": "0xProposerAddress",
            "description": "Test Proposal",
            "options": ["Option A", "Option B"]
        })
        proposal_id = proposal_response.get_json()["proposal_id"]

        response = self.app.post(f'/vote/{proposal_id}', json={
            "option": "Option A"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.get_json())

    def test_vote_invalid_option(self):
        """Test voting with an invalid option."""
        proposal_response = self.app.post('/propose', json={
            "proposer": "0xProposerAddress",
            "description": "Test Proposal",
            "options": ["Option A", "Option B"]
        })
        proposal_id = proposal_response.get_json()["proposal_id"]

        response = self.app.post(f'/vote/{proposal_id}', json={
            "option": "Invalid Option"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())

    @patch('governance.quantum_simulation.QuantumSimulation')
    def test_simulate_success(self, mock_quantum_simulation):
        """Test successful simulation of a proposal."""
        mock_quantum_simulation.return_value.run_simulation.return_value = {
            "Option A": 0.6,
            "Option B": 0.4
        }

        proposal_response = self.app.post('/propose', json={
            "proposer": "0xProposerAddress",
            "description": "Test Proposal",
            "options": ["Option A", "Option B"]
        })
        proposal_id = proposal_response.get_json()["proposal_id"]

        response = self.app.get(f'/simulate/{proposal_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn("simulation_results", response.get_json())

    def test_simulate_proposal_not_found(self):
        """Test simulation of a non-existent proposal."""
        response = self.app.get('/simulate/nonexistent_id')
        self.assertEqual(response.status_code, 404)
        self.assertIn("error", response.get_json())

    @patch('governance.quantum_simulation.QuantumSimulation')
    def test_list_proposals(self, mock_quantum_simulation):
        """Test listing all proposals."""
        self.app.post('/propose', json={
            "proposer": "0xProposerAddress",
            "description": "Test Proposal 1",
            "options": ["Option A", "Option B"]
        })
        self.app.post('/propose', json={
            "proposer": "0xAnotherAddress",
            "description": "Test Proposal 2",
            "options": ["Option C", "Option D"]
        })

        response = self.app.get('/proposals')
        self.assertEqual(response.status_code, 200)
        proposals = response.get_json()
        self.assertEqual(len(proposals), 2)

if __name__ == '__main__':
    unittest.main()
