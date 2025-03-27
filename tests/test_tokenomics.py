import pytest
from app import create_app, db
from app.models import User, EmotionData
from app.tokenomics import TokenomicsManager

@pytest.fixture
def app():
    """Create a new Flask application instance for testing."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use in-memory database for tests
    with app.app_context():
        db.create_all()  # Create the database tables
        yield app
        db.drop_all()  # Clean up after tests

@pytest.fixture
def client(app):
    """Create a test client for the app."""
    return app.test_client()

@pytest.fixture
def tokenomics_manager():
    """Create an instance of TokenomicsManager for testing."""
    return TokenomicsManager()

@pytest.fixture
def user_with_emotion_data(app):
    """Create a user and associated emotional data for testing."""
    user = User(username='testuser', email='test@example.com', password_hash='hashedpassword')
    db.session.add(user)
    db.session.commit()

    emotion_data = EmotionData(user_id=user.id, heart_rate=70, stress_level=4)
    db.session.add(emotion_data)
    db.session.commit()

    return user

def test_adjust_rewards(user_with_emotion_data, tokenomics_manager):
    """Test adjusting rewards based on emotional data."""
    user_id = user_with_emotion_data.id
    initial_staked_amount = 1000  # Assume the user has staked 1000 tokens
    user_with_emotion_data.staked_amount = initial_staked_amount
    db.session.commit()

    # Adjust rewards
    new_reward = tokenomics_manager.adjust_rewards(user_id)

    # Check that the reward is calculated correctly
    assert new_reward is not None
    assert new_reward == initial_staked_amount * 2  # Assuming the multiplier is 2 for low stress and heart rate

def test_adjust_rewards_no_emotion_data(tokenomics_manager):
    """Test adjusting rewards when there is no emotional data."""
    user_id = 999  # Non-existent user
    new_reward = tokenomics_manager.adjust_rewards(user_id)

    # Check that no reward is adjusted
    assert new_reward is None

def test_calculate_reward_multiplier(tokenomics_manager):
    """Test the reward multiplier calculation."""
    assert tokenomics_manager.calculate_reward_multiplier(50, 2) == 200  # Low heart rate and stress
    assert tokenomics_manager.calculate_reward_multiplier(75, 4) == 100  # Normal conditions
    assert tokenomics_manager.calculate_reward_multiplier(85, 6) == 0    # High stress

def test_distribute_rewards(user_with_emotion_data, tokenomics_manager):
    """Test distributing rewards to all users."""
    user_id = user_with_emotion_data.id
    initial_staked_amount = 1000
    user_with_emotion_data.staked_amount = initial_staked_amount
    db.session.commit()

    # Distribute rewards
    tokenomics_manager.distribute_rewards()

    # Check that the user's total rewards have been updated
    updated_user = User.query.get(user_id)
    assert updated_user.total_rewards > 0  # Ensure that rewards were distributed
