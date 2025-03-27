from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from .models import db, User, Transaction, TransactionSchema, process_transaction
from marshmallow import ValidationError
from flask_socketio import emit
import logging

bp = Blueprint('api', __name__)
logger = logging.getLogger(__name__)

# Initialize JWT Manager
jwt = JWTManager()

@bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.json
    user_schema = UserSchema()

    try:
        user_schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    # Check if user already exists
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User  already exists."}), 409

    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=data['password_hash']  # Hash the password in a real application
    )
    db.session.add(new_user)
    db.session.commit()

    logger.info(f"User  {new_user.username} registered successfully.")
    return jsonify({"message": "User  registered successfully."}), 201

@bp.route('/login', methods=['POST'])
def login():
    """Login a user and return a JWT token."""
    data = request.json
    user = User.query.filter_by(username=data['username']).first()

    if user and user.password_hash == data['password_hash']:  # Verify password in a real application
        access_token = create_access_token(identity=user.id)
        logger.info(f"User  {user.username} logged in successfully.")
        return jsonify(access_token=access_token), 200

    return jsonify({"error": "Invalid credentials."}), 401

@bp.route('/transaction', methods=['POST'])
@jwt_required()
def create_transaction():
    """Create a new transaction."""
    data = request.json
    transaction_schema = TransactionSchema()

    try:
        transaction_schema.validate_transaction(data)
    except ValueError as err:
        return jsonify({"error": str(err)}), 400

    current_user_id = get_jwt_identity()
    new_transaction = Transaction(
        sender_id=current_user_id,
        receiver_id=data['receiver_id'],
        amount=data['amount']
    )
    db.session.add(new_transaction)
    db.session.commit()

    # Process the transaction asynchronously
    process_transaction(new_transaction)

    # Emit a real-time event to notify the receiver
    emit_transaction_event(new_transaction)

    logger.info(f"Transaction {new_transaction.id} created successfully.")
    return jsonify({"message": "Transaction created", "transaction_id": new_transaction.id}), 201

def emit_transaction_event(transaction):
    """Emit a transaction event to notify clients."""
    emit('transaction_event', {
        'transaction_id': transaction.id,
        'status': transaction.status.value,
        'amount': transaction.amount,
        'sender_id': transaction.sender_id,
        'receiver_id': transaction.receiver_id
    }, broadcast=True)

@bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get all transactions for the current user."""
    current_user_id = get_jwt_identity()
    transactions = Transaction.query.filter((Transaction.sender_id == current_user_id) | (Transaction.receiver_id == current_user_id)).all()

    transaction_schema = TransactionSchema(many=True)
    result = transaction_schema.dump(transactions)

    logger.info(f"Retrieved transactions for user {current_user_id}.")
    return jsonify(result), 200
