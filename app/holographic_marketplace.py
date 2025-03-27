from flask import Blueprint, jsonify
from app.models import NFT, User, db
import logging

# Create a Blueprint for the holographic marketplace
marketplace_bp = Blueprint('holographic_marketplace', __name__)

# Set up logging
logger = logging.getLogger(__name__)

@marketplace_bp.route('/api/marketplace/nfts', methods=['GET'])
def list_nfts():
    """List all NFTs available in the marketplace."""
    try:
        nfts = NFT.query.all()
        nft_list = [{
            "id": nft.id,
            "owner": nft.owner,
            "token_uri": nft.token_uri,
            "created_at": nft.created_at.isoformat()
        } for nft in nfts]

        logger.info("Retrieved list of NFTs: %d NFTs found", len(nft_list))
        return jsonify(nft_list), 200
    except Exception as e:
        logger.error("Error retrieving NFTs: %s", e)
        return jsonify({"error": "Failed to retrieve NFTs. Please try again later."}), 500

@marketplace_bp.route('/api/marketplace/nft/<int:nft_id>', methods=['GET'])
def get_nft_details(nft_id):
    """Retrieve detailed information about a specific NFT."""
    try:
        nft = NFT.query.get(nft_id)
        if not nft:
            logger.warning("NFT not found: %d", nft_id)
            return jsonify({"error": "NFT not found."}), 404

        nft_details = {
            "id": nft.id,
            "owner": nft.owner,
            "token_uri": nft.token_uri,
            "created_at": nft.created_at.isoformat(),
            "description": nft.description,  # Assuming a description field exists
            "price": nft.price  # Assuming a price field exists
        }
        logger.info("Retrieved details for NFT %d", nft_id)
        return jsonify(nft_details), 200
    except Exception as e:
        logger.error("Error retrieving NFT details: %s", e)
        return jsonify({"error": "Failed to retrieve NFT details. Please try again later."}), 500

@marketplace_bp.route('/api/marketplace/user/<int:user_id>/nfts', methods=['GET'])
def get_user_nfts(user_id):
    """Retrieve all NFTs owned by a specific user."""
    try:
        user = User.query.get(user_id)
        if not user:
            logger.warning("User  not found: %d", user_id)
            return jsonify({"error": "User  not found."}), 404

        nfts = NFT.query.filter_by(owner=user.wallet_address).all()  # Assuming wallet_address is used for ownership
        nft_list = [{
            "id": nft.id,
            "token_uri": nft.token_uri,
            "created_at": nft.created_at.isoformat()
        } for nft in nfts]

        logger.info("Retrieved %d NFTs for user %d", len(nft_list), user_id)
        return jsonify(nft_list), 200
    except Exception as e:
        logger.error("Error retrieving NFTs for user %d: %s", user_id, e)
        return jsonify({"error": "Failed to retrieve user NFTs. Please try again later."}), 500

@marketplace_bp.route('/api/marketplace/sell/<int:nft_id>', methods=['POST'])
def sell_nft(nft_id):
    """Sell an NFT by setting its price."""
    data = request.json
    user_id = data.get('user_id')
    price = data.get('price')

    if not user_id or price is None:
        logger.error("Invalid data received for selling NFT: %s", data)
        return jsonify({"error": "Invalid data. Please provide user_id and price."}), 400

    try:
        user = User.query.get(user_id)
        if not user:
            logger.warning("User  not found: %d", user_id)
            return jsonify({"error": "User  not found."}), 404

        nft = NFT.query.get(nft_id)
        if not nft:
            logger.warning("NFT not found: %d", nft_id)
            return jsonify({"error": "NFT not found."}), 404

        # Set the price for the NFT
        nft.price = price
        db.session.commit()

        logger.info("NFT %d set for sale by user %d at price %s", nft_id, user_id, price)
        return jsonify({"message": "NFT is now for sale.", "price": price}), 200
    except Exception as e:
        logger.error("Error selling NFT %d: %s", nft_id, e)
        return jsonify({"error": "Failed to sell NFT. Please try again later."}), 500
