from flask import Flask, request, jsonify
from web3 import Web3
import logging
import os

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Connect to Ethereum network
w3 = Web3(Web3.HTTPProvider('https://YOUR_ETHEREUM_NODE_URL'))
contract_address = 'YOUR_ECO_STAKING_CONTRACT_ADDRESS'
private_key = os.getenv('PRIVATE_KEY')  # Store your private key securely
account_address = 'YOUR_ACCOUNT_ADDRESS'  # Your wallet address

# Load the EcoStaking contract
with open('EcoStakingABI.json') as f:
    abi = f.read()
eco_staking_contract = w3.eth.contract(address=contract_address, abi=abi)

# Endpoint to receive data from IoT sensors
@app.route('/api/iot-data', methods=['POST'])
def receive_iot_data():
    data = request.json
    logging.info(f"Received IoT data: {data}")

    # Validate incoming data
    if 'project' not in data or 'amount' not in data:
        return jsonify({"error": "Invalid data. 'project' and 'amount' are required."}), 400

    project = data['project']
    amount = data['amount']

    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({"error": "Invalid amount. Must be a positive number."}), 400

    # Trigger reward distribution based on the project
    try:
        distribute_rewards(project, amount)
        return jsonify({"message": "Data received and processed successfully."}), 200
    except Exception as e:
        logging.error(f"Error processing data: {e}")
        return jsonify({"error": "Failed to process data."}), 500

def distribute_rewards(project, amount):
    # Logic to distribute rewards based on the project and amount
    # This could involve calling the EcoStaking smart contract
    logging.info(f"Distributing rewards for project: {project} with amount: {amount}")

    # Example: Call the smart contract to distribute rewards
    tx = eco_staking_contract.functions.distributeRewards(amount).buildTransaction({
        'from': account_address,
        'nonce': w3.eth.getTransactionCount(account_address),
        'gas': 2000000,
        'gasPrice': w3.toWei('50', 'gwei')
    })

    # Sign the transaction
    signed_tx = w3.eth.account.signTransaction(tx, private_key)
    
    # Send the transaction
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    logging.info(f"Transaction sent: {tx_hash.hex()}")

if __name__ == '__main__':
    app.run(port=5000)
