from flask import Blueprint, request, jsonify
from app.models import EmotionData, db
import logging

# Create a Blueprint for the emotion API
emotion_bp = Blueprint('emotion_api', __name__)

# Set up logging
logger = logging.getLogger(__name__)

@emotion_bp.route('/api/emotion', methods=['POST'])
def receive_emotion_data():
    """Receive emotional data from wearable devices."""
    data = request.json

    # Validate incoming data
    user_id = data.get('user_id')
    heart_rate = data.get('heart_rate')
    stress_level = data.get('stress_level')

    if not user_id or heart_rate is None or stress_level is None:
        logger.error("Invalid data received: %s", data)
        return jsonify({"error": "Invalid data. Please provide user_id, heart_rate, and stress_level."}), 400

    # Create a new EmotionData instance
    emotion_data = EmotionData(user_id=user_id, heart_rate=heart_rate, stress_level=stress_level)

    # Store the data in the database
    try:
        db.session.add(emotion_data)
        db.session.commit()
        logger.info(f"Received emotion data from user {user_id}: HR={heart_rate}, Stress={stress_level}")
        return jsonify({"message": "Data received successfully"}), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        logger.error(f"Error saving emotion data: {e}")
        return jsonify({"error": "Failed to save data. Please try again later."}), 500

@emotion_bp.route('/api/emotion/<string:user_id>', methods=['GET'])
def get_emotion_data(user_id):
    """Retrieve emotional data for a specific user."""
    try:
        emotion_data = EmotionData.query.filter_by(user_id=user_id).all()
        if not emotion_data:
            return jsonify({"message": "No data found for this user."}), 404

        # Serialize the data
        data = [{"heart_rate": ed.heart_rate, "stress_level": ed.stress_level, "timestamp": ed.timestamp} for ed in emotion_data]
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error retrieving emotion data for user {user_id}: {e}")
        return jsonify({"error": "Failed to retrieve data. Please try again later."}), 500
