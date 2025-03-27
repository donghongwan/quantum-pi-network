import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO
from celery import Celery
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()
celery = Celery(__name__, broker=os.getenv('CELERY_BROKER_URL'))

def create_app():
    app = Flask(__name__)
    
    # Load configuration from environment variables
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///transactions.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['CELERY_BROKER_URL'] = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    app.config['CELERY_RESULT_BACKEND'] = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)
    CORS(app)

    # Register blueprints
    from .routes import api_bp
    app.register_blueprint(api_bp)

    # Register background tasks
    from .tasks import background_tasks
    celery.conf.update(app.config)

    # Log application startup
    logger.info("Quantum Pi Network application started.")

    return app

@celery.task
def process_transaction(transaction_id):
    """Background task to process transactions asynchronously."""
    logger.info(f"Processing transaction {transaction_id}...")
    # Simulate processing logic (e.g., sending via DTN)
    # Here you would implement the actual transaction processing logic
    logger.info(f"Transaction {transaction_id} processed successfully.")

if __name__ == '__main__':
    app = create_app()
    socketio.run(app, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
