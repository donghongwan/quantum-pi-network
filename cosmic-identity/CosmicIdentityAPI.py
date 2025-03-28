from flask import Flask, request, jsonify
from web3 import Web3
import requests
import os
import logging
from functools import wraps

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Connect to Ethereum network
w3 = Web3(Web3.HTTPProvider('https://YOUR_ETHEREUM_NODE_URL'))

# Load the CosmicIdentityVerification contract
with open('CosmicIdentityVerificationABI.json') as f:
    abi = f.read()
cosmic_identity_contract = w3.eth.contract(address='YOUR_COSMIC_IDENTITY_CONTRACT_ADDRESS', abi=abi)

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

def fetch_cosmic_data():
    """Fetch cosmic data from an astronomical API (e.g., NASA)."""
    # Example API call to NASA (replace with actual endpoint and parameters)
    response = requests.get('https://api.le-systeme-solaire.net/rest/bodies/')
    if response.status_code == 200:
        data = response.json()
        # Process and return relevant cosmic data
        return data['bodies'][0]['mass']  # Example: return mass of the first body
    else:
        logging.error("Failed to fetch cosmic data.")
        return None

@app.route('/api/register-identity', methods=['POST'])
@requires_auth
def register_identity():
    data = request.json
    cosmic_fingerprint = data.get('cosmic_fingerprint')

    if not cosmic_fingerprint:
        return jsonify({"error": "Cosmic fingerprint is required."}), 400

    try:
        tx = cosmic_identity_contract.functions.registerIdentity(cosmic_fingerprint).buildTransaction({
            'from': 'YOUR_ACCOUNT_ADDRESS',
            'nonce': w3.eth.getTransactionCount('YOUR_ACCOUNT_ADDRESS'),
            'gas': 2000000,
            'gasPrice': w3.toWei('50', 'gwei')
        })

        # Sign the transaction
        signed_tx = w3.eth.account.signTransaction(tx, os.getenv('PRIVATE_KEY'))

        # Send the transaction
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        logging.info(f"Identity registered: {tx_hash.hex()}")
        return jsonify({"tx_hash": tx_hash.hex()}), 200
    except Exception as e:
        logging.error(f"Error registering identity: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/verify-identity', methods=['POST'])
@requires_auth
def verify_identity():
    data = request.json
    user_address = data.get('user_address')

    if not user_address:
        return jsonify({"error": "User  address is required."}), 400

    try:
        tx = cosmic_identity_contract.functions.verifyIdentity(user_address).buildTransaction({
            'from': 'YOUR_ACCOUNT_ADDRESS',
            'nonce': w3.eth.getTransactionCount('YOUR_ACCOUNT_ADDRESS'),
            'gas': 2000000,
            'gasPrice': w3.toWei('50', 'gwei')
        })

        # Sign the transaction
        signed_tx = w3.eth.account.signTransaction(tx, os.getenv('PRIVATE_KEY'))

        # Send the transaction
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        logging.info(f"Identity verified: {tx_hash.hex()}")
        return jsonify({"tx_hash": tx_hash.hex()}), 200
    except Exception as e:
        logging.error(f"Error verifying identity: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/fetch-cosmic-data', methods=['GET'])
def get_cosmic_data():
    """Fetch and return cosmic data."""
    cosmic_data = fetch_cosmic_data()
    if cosmic_data is not None:
        return jsonify({"cosmic_data": cosmic_data}), 200
    else:
        return jsonify({"error": "Failed to fetch cosmic data."}), 500

if __name__ == '__main__':
    app.run(port=5000)
