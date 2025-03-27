import pytest
from app import create_app, db
from app.models import User, NFT

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
def user():
    """Create a user for testing."""
    user = User(username='testuser', email='test@example.com', password_hash='hashedpassword', wallet_address='0x123')
    db.session.add(user)
    db.session.commit()
    return user

def test_mint_nft(client, user):
    """Test minting a new NFT."""
    response = client.post('/api/nft/mint', json={
        'user_id': user.id,
        'token_uri': 'https://example.com/nft/1'
    })
    assert response.status_code == 201
    assert b'NFT minted successfully' in response.data

    # Check if the NFT is created in the database
    nft = NFT.query.first()
    assert nft is not None
    assert nft.token_uri == 'https://example.com/nft/1'
    assert nft.owner == user.wallet_address

def test_mint_nft_invalid_user(client):
    """Test minting an NFT with an invalid user ID."""
    response = client.post('/api/nft/mint', json={
        'user_id': 999,  # Non-existent user
        'token_uri': 'https://example.com/nft/1'
    })
    assert response.status_code == 404
    assert b'User  not found.' in response.data

def test_get_nft(client, user):
    """Test retrieving an NFT."""
    # First, mint an NFT
    client.post('/api/nft/mint', json={
        'user_id': user.id,
        'token_uri': 'https://example.com/nft/1'
    })

    # Retrieve the NFT
    nft = NFT.query.first()
    response = client.get(f'/api/nft/{nft.id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['token_uri'] == 'https://example.com/nft/1'
    assert data['owner'] == user.wallet_address

def test_get_nft_not_found(client):
    """Test retrieving a non-existent NFT."""
    response = client.get('/api/nft/999')  # Non-existent NFT ID
    assert response.status_code == 404
    assert b'NFT not found.' in response.data

def test_buy_nft(client, user):
    """Test buying an NFT."""
    # Mint an NFT first
    client.post('/api/nft/mint', json={
        'user_id': user.id,
        'token_uri': 'https://example.com/nft/1'
    })

    # Retrieve the NFT
    nft = NFT.query.first()
    nft.owner = user.wallet_address  # Set the owner to the user for the test
    db.session.commit()

    # Create another user to buy the NFT
    buyer = User(username='buyer', email='buyer@example.com', password_hash='hashedpassword', wallet_address='0x456')
    db.session.add(buyer)
    db.session.commit()

    # Buy the NFT
    response = client.post(f'/api/nft/buy/{nft.id}', json={
        'user_id': buyer.id
    })
    assert response.status_code == 200
    assert b'NFT bought successfully' in response.data

    # Check if the NFT ownership has changed
    updated_nft = NFT.query.get(nft.id)
    assert updated_nft.owner == buyer.wallet_address

def test_buy_nft_not_for_sale(client, user):
    """Test buying an NFT that is not for sale."""
    # Mint an NFT first
    client.post('/api/nft/mint', json={
        'user_id': user.id,
        'token_uri': 'https://example.com/nft/1'
    })

    # Retrieve the NFT
    nft = NFT.query.first()
    nft.owner = user.wallet_address  # Set the owner to the user for the test
    db.session.commit()

    # Create another user to buy the NFT
    buyer = User(username='buyer', email='buyer@example.com', password_hash='hashedpassword', wallet_address='0x456')
    db.session.add(buyer)
    db.session.commit()

    # Attempt to buy the NFT without listing it for sale
    response = client.post(f'/api/nft/buy/{nft.id}', json={
        'user_id': buyer.id
    })
    assert response.status_code == 400
    assert b'NFT is not for sale' in response.data
