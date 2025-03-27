import logging
from app.models import User, EmotionData, db

# Set up logging
logger = logging.getLogger(__name__)

class TokenomicsManager:
    def __init__(self):
        """Initialize the TokenomicsManager."""
        logger.info("TokenomicsManager initialized.")

    def adjust_rewards(self, user_id):
        """Adjust staking rewards based on emotional data."""
        try:
            # Retrieve the latest emotional data for the user
            latest_emotion_data = EmotionData.query.filter_by(user_id=user_id).order_by(EmotionData.timestamp.desc()).first()
            if not latest_emotion_data:
                logger.warning(f"No emotional data found for user {user_id}.")
                return None  # No data to adjust rewards

            heart_rate = latest_emotion_data.heart_rate
            stress_level = latest_emotion_data.stress_level

            # Calculate the reward multiplier based on emotional data
            reward_multiplier = self.calculate_reward_multiplier(heart_rate, stress_level)

            # Update user rewards in the database
            user = User.query.get(user_id)
            if user:
                user.staking_rewards *= reward_multiplier  # Adjust the user's staking rewards
                db.session.commit()
                logger.info(f"Adjusted rewards for user {user_id}: New reward = {user.staking_rewards}")
                return user.staking_rewards
            else:
                logger.error(f"User  {user_id} not found.")
                return None

        except Exception as e:
            logger.error(f"Error adjusting rewards for user {user_id}: {e}")
            return None

    def calculate_reward_multiplier(self, heart_rate, stress_level):
        """Calculate reward multiplier based on emotional data."""
        if heart_rate < 60 and stress_level < 3:
            return 2  # Double rewards for low stress and heart rate
        elif heart_rate < 80 and stress_level < 5:
            return 1  # Normal rewards
        else:
            return 0  # No rewards for high stress

    def distribute_rewards(self):
        """Distribute rewards to all users based on their emotional data."""
        users = User.query.all()
        for user in users:
            new_reward = self.adjust_rewards(user.id)
            if new_reward is not None:
                logger.info(f"Distributed rewards to user {user.id}: {new_reward}")

# Example usage
if __name__ == "__main__":
    tokenomics_manager = TokenomicsManager()
    # This would typically be called in response to an event or on a schedule
    tokenomics_manager.distribute_rewards()
