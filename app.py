from flask import Flask, request, jsonify
from governance.proposal import GovernanceProposal
from governance.quantum_simulation import QuantumSimulation
import uuid
import logging

app = Flask(__name__)

# Store proposals in memory (for demonstration purposes)
proposals = {}
quantum_simulation = QuantumSimulation()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/propose', methods=['POST'])
def propose():
    """Endpoint to submit a governance proposal."""
    data = request.json
    if not all(key in data for key in ('proposer', 'description', 'options')):
        return jsonify({"error": "Missing required fields."}), 400

    proposal_id = str(uuid.uuid4())  # Use UUID for unique proposal ID
    proposal = GovernanceProposal(data['proposer'], data['description'], data['options'])
    proposals[proposal_id] = proposal
    logger.info("Proposal created: %s", proposal_id)
    return jsonify({"proposal_id": proposal_id}), 201

@app.route('/vote/<string:proposal_id>', methods=['POST'])
def vote(proposal_id):
    """Endpoint to vote on a governance proposal."""
    data = request.json
    option = data.get('option')
    proposal = proposals.get(proposal_id)

    if proposal:
        try:
            proposal.vote(option)
            logger.info("Vote cast for proposal %s by %s", proposal_id, proposal.proposer)
            return jsonify({"message": "Vote cast successfully."}), 200
        except ValueError as e:
            logger.error("Voting error: %s", str(e))
            return jsonify({"error": str(e)}), 400
    else:
        logger.warning("Proposal not found: %s", proposal_id)
        return jsonify({"error": "Proposal not found."}), 404

@app.route('/simulate/<string:proposal_id>', methods=['GET'])
def simulate(proposal_id):
    """Endpoint to simulate a governance proposal."""
    proposal = proposals.get(proposal_id)

    if proposal:
        results = proposal.simulate(quantum_simulation)
        logger.info("Simulation results for proposal %s: %s", proposal_id, results)
        return jsonify({"proposal_id": proposal_id, "simulation_results": results}), 200
    else:
        logger.warning("Proposal not found for simulation: %s", proposal_id)
        return jsonify({"error": "Proposal not found."}), 404

@app.route('/proposals', methods=['GET'])
def list_proposals():
    """Endpoint to list all proposals."""
    return jsonify({proposal_id: proposal.get_summary() for proposal_id, proposal in proposals.items()}), 200

if __name__ == '__main__':
    app.run(debug=True)
