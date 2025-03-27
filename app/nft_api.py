from flask import Blueprint, request, jsonify
from app.models import NFT, User, db
from web3 import Web3
import logging

# Create a Blueprint for the NFT API
nft_bp = Blueprint('nft_api', __name__)

# Set up logging
logger = logging.getLogger(__name__)

# Connect to the Ethereum blockchain (or your chosen blockchain)
w3 = Web3(Web3.HTTPProvider('https://your.ethereum.node'))  # Replace with your Ethereum node URL

# Load your smart contract
contract_address = '0xYourContractAddress'  # Replace with your deployed contract address
contract_abi = [...]  # Replace with your contract ABI
nft_contract = w3.eth.contract(address=contract_address, abi=contract_abi)

@nft_bp.route('/api/nft/mint', methods=['POST'])
def mint_nft():
    """Mint a new NFT."""
    data = request.json
    user_id = data.get('user_id')
    token_uri = data.get('token_uri')

    if not user_id or not token_uri:
        logger.error("Invalid data received for minting NFT: %s", data)
        return jsonify({"error": "Invalid data. Please provide user_id and token_uri."}), 400

    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        logger.error("User  not found: %s", user_id)
        return jsonify({"error": "User  not found."}), 404

    # Mint the NFT
    try:
        # Assuming the user has already connected their wallet and we have their address
        user_address = user.wallet_address  # Ensure this field exists in your User model
        tx_hash = nft_contract.functions.mintNFT(user_address, token_uri).transact({'from': user_address})

        # Wait for the transaction to be mined
        w3.eth.waitForTransactionReceipt(tx_hash)

        logger.info("NFT minted successfully for user %s: %s", user_id, token_uri)
        return jsonify({"message": "NFT minted successfully.", "transaction_hash": tx_hash.hex()}), 201
    except Exception as e:
        logger.error("Error minting NFT: %s", e)
        return jsonify({"error": "Failed to mint NFT. Please try again later."}), 500

@nft_bp.route('/api/nft/<int:nft_id>', methods=['GET'])
def get_nft(nft_id):
    """Retrieve information about a specific NFT."""
    nft = NFT.query.get(nft_id)
    if not nft:
        logger.warning("NFT not found: %d", nft_id)
        return jsonify({"error": "NFT not found."}), 404

    nft_info = {
        "id": nft.id,
        "owner": nft.owner,
        "token_uri": nft.token_uri,
        "created_at": nft.created_at.isoformat()
    }
    return jsonify(nft_info), 200

@nft_bp.route('/api/nft/buy/<int:nft_id>', methods=['POST'])
def buy_nft(nft_id):
    """Buy an NFT."""
    data = request.json
    buyer_id = data.get('user_id')

    if not buyer_id:
        logger.error("Invalid data received for buying NFT: %s", data)
        return jsonify({"error": "Invalid data. Please provide user_id."}), 400

    # Check if buyer exists
    buyer = User.query.get(buyer_id)
    if not buyer:
        logger.error("Buyer not found: %s", buyer_id)
        return jsonify({"error": "Buyer not found."}), 404

    # Retrieve the NFT
    nft = NFT.query.get(nft_id)
    if not nft:
        logger.warning("NFT not found: %d", nft_id)
        return jsonify({"error": "NFT not found."}), 404

    # Transfer ownership of the NFT
    try:
        seller_address = nft.owner  # Assuming this is stored in the NFT model
        buyer_address = buyer.wallet_address

        # Call the smart contract function to transfer the NFT
        tx_hash = nft_contract.functions.transferFrom(seller_address, buyer_address, nft_id).transact({'from': buyer_address})

        # Wait for the transaction to be mined
        w3.eth.waitForTransactionReceipt(tx_hash)

        # Update the NFT owner in the database
        nft.owner = buyer_address
        db.session.commit()

        logger.info("NFT %d bought successfully by user %s", nft_id, buyer_id)
        return jsonify({"message": "NFT bought successfully.", "transaction_hash": tx_hash.hex()}), 200
    except Exception as e:
        logger.error("Error buying NFT: %s", e)
        return jsonify({"error": "Failed to buy NFT. Please try again later."}), 500
