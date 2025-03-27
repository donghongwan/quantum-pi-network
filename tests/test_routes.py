import pytest
from app import create_app, db
from app.models import User, Transaction
from flask_jwt_extended import create_access_token

@pytest.fixture
def app():
    """Create a new Flask application instance for testing."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use in-memory database for tests
    app.config['JWT_SECRET_KEY'] = 'test_secret'  # Set a test secret key
    with app.app_context():
        db.create_all()  # Create the database tables
        yield app
        db.drop_all()  # Clean up after tests

@pytest.fixture
def client(app):
    """Create a test client for the app."""
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    """Create a user and return authentication headers."""
    user = User(username='testuser', email='test@example.com', password_hash='testpassword')  # Hash the password in a real application
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return {'Authorization': f'Bearer {access_token}'}

def test_register(client):
    """Test user registration."""
    response = client.post('/register', json={
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password_hash': 'newpassword'  # Hash the password in a real application
    })
    assert response.status_code == 201
    assert b'User registered successfully.' in response.data

def test_register_existing_user(client):
    """Test registration of an existing user."""
    client.post('/register', json={
        'username': 'existinguser',
        'email': 'existinguser@example.com',
        'password_hash': 'password'
    })
    response = client.post('/register', json={
        'username': 'existinguser',
        'email': 'existinguser@example.com',
        'password_hash': 'password'
    })
    assert response.status_code == 409
    assert b'User already exists.' in response.data

def test_login(client):
    """Test user login."""
    client.post('/register', json={
        'username': 'loginuser',
        'email': 'loginuser@example.com',
        'password_hash': 'loginpassword'  # Hash the password in a real application
    })
    response = client.post('/login', json={
        'username': 'loginuser',
        'password_hash': 'loginpassword'  # Hash the password in a real application
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

def test_create_transaction(client, auth_headers):
    """Test creating a transaction."""
    receiver = User(username='receiver', email='receiver@example.com', password_hash='receiverpassword')
    db.session.add(receiver)
    db.session.commit()

    response = client.post('/transaction', headers=auth_headers, json={
        'receiver_id': receiver.id,
        'amount': 100.0
    })
    assert response.status_code == 201
    assert b'Transaction created' in response.data

def test_get_transactions(client, auth_headers):
    """Test retrieving transactions for the current user."""
    receiver = User(username='receiver2', email='receiver2@example.com', password_hash='receiverpassword')
    db.session.add(receiver)
    db.session.commit()

    # Create a transaction
    transaction = Transaction(sender_id=1, receiver_id=receiver.id, amount=50.0)
    db.session.add(transaction)
    db.session.commit()

    response = client.get('/transactions', headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json) == 1  # Expecting one transaction

def test_create_transaction_invalid_amount(client, auth_headers):
    """Test creating a transaction with an invalid amount."""
    receiver = User(username='receiver3', email='receiver3@example.com', password_hash='receiverpassword')
    db.session.add(receiver)
    db.session.commit()

    response = client.post('/transaction', headers=auth_headers, json={
        'receiver_id': receiver.id,
        'amount': -50.0  # Invalid amount
    })
    assert response.status_code == 400
    assert b'Transaction amount must be greater than zero.' in response.data
