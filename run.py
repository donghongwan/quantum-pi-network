import os
import logging
from app import create_app, db
from flask_socketio import SocketIO

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """Main entry point for the application."""
    # Create the Flask application
    app = create_app()

    # Initialize SocketIO
    socketio = SocketIO(app)

    # Run the application
    try:
        port = int(os.getenv('PORT', 5000))  # Default to port 5000 if not specified
        logger.info(f"Starting Quantum Pi Network on port {port}...")
        socketio.run(app, host='0.0.0.0', port=port)
    except Exception as e:
        logger.error(f"Failed to start the application: {e}")
        exit(1)

if __name__ == '__main__':
    main()
