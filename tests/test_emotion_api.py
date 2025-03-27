import pytest
from app import create_app, db
from app.models import EmotionData

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

def test_receive_emotion_data(client):
    """Test receiving valid emotional data."""
    response = client.post('/api/emotion', json={
        'user_id': 'user123',
        'heart_rate': 70,
        'stress_level': 4
    })
    assert response.status_code == 201
    assert b'Data received successfully' in response.data

def test_receive_emotion_data_invalid(client):
    """Test receiving invalid emotional data (missing fields)."""
    response = client.post('/api/emotion', json={
        'user_id': 'user123',
        'heart_rate': 70
        # Missing stress_level
    })
    assert response.status_code == 400
    assert b'Invalid data. Please provide user_id, heart_rate, and stress_level.' in response.data

def test_receive_emotion_data_negative_values(client):
    """Test receiving emotional data with negative values."""
    response = client.post('/api/emotion', json={
        'user_id': 'user123',
        'heart_rate': -10,
        'stress_level': -1
    })
    assert response.status_code == 400
    assert b'Invalid data. Please provide user_id, heart_rate, and stress_level.' in response.data

def test_get_emotion_data(client):
    """Test retrieving emotional data for a specific user."""
    # First, post some emotion data
    client.post('/api/emotion', json={
        'user_id': 'user123',
        'heart_rate': 70,
        'stress_level': 4
    })
    client.post('/api/emotion', json={
        'user_id': 'user123',
        'heart_rate': 75,
        'stress_level': 3
    })

    # Now retrieve the data
    response = client.get('/api/emotion/user123')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2  # We posted two entries
    assert data[0]['heart_rate'] == 70
    assert data[1]['stress_level'] == 3

def test_get_emotion_data_no_data(client):
    """Test retrieving emotional data for a user with no data."""
    response = client.get('/api/emotion/user456')
    assert response.status_code == 404
    assert b'No data found for this user.' in response.data
