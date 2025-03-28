from flask import Flask, request, jsonify
from web3 import Web3
import os
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to the Ethereum blockchain
w3 = Web3(Web3.HTTPProvider(os.getenv('ETH_NODE_URL')))

# Smart contract address and ABI (replace with your contract details)
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
CONTRACT_ABI = [...]  # Replace with your contract ABI

# Initialize the contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

@app.route('/fund_experiment', methods=['POST'])
def fund_experiment():
    """Endpoint to fund a DNA/RNA experiment."""
    data = request.json
    user_address = data.get('user_address')
    amount = data.get('amount')
    experiment_id = data.get('experiment_id')

    # Validate input
    if not user_address or not amount or not experiment_id:
        logger.error("Invalid input: %s", data)
        return jsonify({"error": "Invalid input"}), 400

    try:
        # Create transaction to fund the experiment
        tx = contract.functions.fundExperiment(experiment_id).buildTransaction({
            'from': user_address,
            'value': w3.toWei(amount, 'ether'),
            'gas': 2000000,
            'gasPrice': w3.toWei('50', 'gwei'),
            'nonce': w3.eth.getTransactionCount(user_address),
        })

        # Sign and send the transaction
        signed_tx = w3.eth.account.signTransaction(tx, private_key=os.getenv('PRIVATE_KEY'))
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)

        logger.info("Transaction successful: %s", tx_hash.hex())
        return jsonify({"transaction_hash": tx_hash.hex()}), 200

    except Exception as e:
        logger.error("Transaction failed: %s", str(e))
        return jsonify({"error": "Transaction failed"}), 500

@app.route('/experiment_status/<experiment_id>', methods=['GET'])
def experiment_status(experiment_id):
    """Endpoint to get the status of a DNA/RNA experiment."""
    try:
        # Fetch status from the smart contract
        status = contract.functions.getExperimentStatus(experiment_id).call()
        return jsonify({"experiment_id": experiment_id, "status": status}), 200

    except Exception as e:
        logger.error("Failed to retrieve status for experiment %s: %s", experiment_id, str(e))
        return jsonify({"error": "Failed to retrieve status"}), 500

if __name__ == '__main__':
    app.run(debug=True)
