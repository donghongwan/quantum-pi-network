from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, Integer, String, Float, DateTime, Enum
from marshmallow import Schema, fields, validate, ValidationError
import enum

db = SQLAlchemy()

class TransactionStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class BaseModel:
    """Base model with common attributes."""
    id = db.Column(Integer, primary_key=True)
    created_at = db.Column(DateTime, default=datetime.utcnow)
    updated_at = db.Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

class User(BaseModel, db.Model):
    """User model representing a user in the system."""
    username = db.Column(String(100), unique=True, nullable=False)
    email = db.Column(String(120), unique=True, nullable=False)
    password_hash = db.Column(String(128), nullable=False)

    transactions = relationship('Transaction', back_populates='user')

    def __repr__(self):
        return f'<User {self.username}>'

class Transaction(BaseModel, db.Model):
    """Transaction model representing a financial transaction."""
    sender_id = db.Column(Integer, ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(Integer, ForeignKey('user.id'), nullable=False)
    amount = db.Column(Float, nullable=False)
    status = db.Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)

    user = relationship('User', foreign_keys=[sender_id])
    receiver = relationship('User', foreign_keys=[receiver_id])

    def __repr__(self):
        return f'<Transaction {self.id} from {self.user.username} to {self.receiver.username}>'

class TransactionSchema(Schema):
    """Schema for validating transaction data."""
    sender_id = fields.Int(required=True, validate=validate.Range(min=1))
    receiver_id = fields.Int(required=True, validate=validate.Range(min=1))
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))

    @staticmethod
    def validate_transaction(data):
        """Validate transaction data."""
        schema = TransactionSchema()
        try:
            schema.load(data)
        except ValidationError as err:
            raise ValueError(f"Validation error: {err.messages}")

class UserSchema(Schema):
    """Schema for validating user data."""
    username = fields.Str(required=True, validate=validate.Length(min=3, max=100))
    email = fields.Email(required=True)
    password_hash = fields.Str(required=True, validate=validate.Length(min=6))

# Example of a machine learning model integration
class MLModel:
    """Placeholder for a machine learning model."""
    def __init__(self, model_path):
        self.model_path = model_path
        # Load the model from the specified path
        self.load_model()

    def load_model(self):
        """Load the machine learning model."""
        # Implement model loading logic here
        pass

    def predict(self, features):
        """Make predictions based on input features."""
        # Implement prediction logic here
        return True  # Placeholder return value

# Initialize the machine learning model
ml_model = MLModel(model_path='models/transaction_model.pkl')

def process_transaction(transaction):
    """Process a transaction and update its status."""
    # Example of using the ML model for prediction
    features = [transaction.amount]  # Example feature extraction
    prediction = ml_model.predict(features)

    if prediction:
        transaction.status = TransactionStatus.COMPLETED
    else:
        transaction.status = TransactionStatus.FAILED

    db.session.commit()
