from flask import Flask, request, jsonify
from web3 import Web3
import logging
import os
from functools import wraps

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Connect to Ethereum network
w3 = Web3(Web3.HTTPProvider('https://YOUR_ETHEREUM_NODE_URL'))

# Load the FractalGovernance contract
with open('FractalGovernanceABI.json') as f:
    abi = f.read()
fractal_governance_contract = w3.eth.contract(address='YOUR_FRACTAL_GOVERNANCE_CONTRACT_ADDRESS', abi=abi)

# Basic authentication
def check_auth(username, password):
    return username == os.getenv('API_USERNAME') and password == os.getenv('API_PASSWORD')

def authenticate():
    return jsonify({"error": "Authentication required"}), 401

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

# Endpoint to create a new DAO
@app.route('/api/create-dao', methods=['POST'])
@requires_auth
def create_dao():
    try:
        tx = fractal_governance_contract.functions.createDao().buildTransaction({
            'from': 'YOUR_ACCOUNT_ADDRESS',
            'nonce': w3.eth.getTransactionCount('YOUR_ACCOUNT_ADDRESS'),
            'gas': 2000000,
            'gasPrice': w3.toWei('50', 'gwei')
        })

        # Sign the transaction
        signed_tx = w3.eth.account.signTransaction(tx, os.getenv('PRIVATE_KEY'))

        # Send the transaction
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        logging.info(f"DAO created: {tx_hash.hex()}")
        return jsonify({"tx_hash": tx_hash.hex()}), 200
    except Exception as e:
        logging.error(f"Error creating DAO: {e}")
        return jsonify({"error": str(e)}), 500

# Endpoint to add a DAO as a child to another DAO
@app.route('/api/add-child-dao', methods=['POST'])
@requires_auth
def add_child_dao():
    data = request.json
    parent_dao = data.get('parent_dao')
    child_dao = data.get('child_dao')

    if not parent_dao or not child_dao:
        return jsonify({"error": "Both parent_dao and child_dao are required."}), 400

    try:
        tx = fractal_governance_contract.functions.addChildDao(parent_dao, child_dao).buildTransaction({
            'from': 'YOUR_ACCOUNT_ADDRESS',
            'nonce': w3.eth.getTransactionCount('YOUR_ACCOUNT_ADDRESS'),
            'gas': 2000000,
            'gasPrice': w3.toWei('50', 'gwei')
        })

        # Sign the transaction
        signed_tx = w3.eth.account.signTransaction(tx, os.getenv('PRIVATE_KEY'))

        # Send the transaction
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        logging.info(f"Child DAO added: {tx_hash.hex()}")
        return jsonify({"tx_hash": tx_hash.hex()}), 200
    except Exception as e:
        logging.error(f"Error adding child DAO: {e}")
        return jsonify({"error": str(e)}), 500

# Endpoint to vote on a DAO decision
@app.route('/api/vote', methods=['POST'])
@requires_auth
def vote():
    data = request.json
    dao_id = data.get('dao_id')
    vote_count = data.get('vote_count')

    if not dao_id or not vote_count:
        return jsonify({"error": "Both dao_id and vote_count are required."}), 400

    try:
        tx = fractal_governance_contract.functions.vote(dao_id, vote_count).buildTransaction({
            'from': 'YOUR_ACCOUNT_ADDRESS',
            'nonce': w3.eth.getTransactionCount('YOUR_ACCOUNT_ADDRESS'),
            'gas': 2000000,
            'gasPrice': w3.toWei('50', 'gwei')
        })

        # Sign the transaction
        signed_tx = w3.eth.account.signTransaction(tx, os.getenv('PRIVATE_KEY'))

        # Send the transaction
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        logging.info(f"Vote cast: {tx_hash.hex()}")
        return jsonify({"tx_hash": tx_hash.hex()}), 200
    except Exception as e:
        logging.error(f"Error casting vote: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
