import logging
import os
import json
from logging.handlers import RotatingFileHandler, SocketHandler
from concurrent_log_handler import ConcurrentRotatingFileHandler

class Logger:
    """Logging utility for the Quantum-Pi Network."""

    def __init__(self, log_file='quantum_pi_network.log', log_level=None):
        # Set default log level from environment variable or use INFO
        self.log_level = log_level or os.getenv('LOG_LEVEL', 'INFO').upper()
        self.logger = logging.getLogger("QuantumPiNetwork")
        self.logger.setLevel(self.log_level)

        # Create a console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(self.log_level)

        # Create a rotating file handler with concurrency support
        file_handler = ConcurrentRotatingFileHandler(log_file, maxBytes=5*1024*1024, backupCount=5)  # 5 MB per file
        file_handler.setLevel(self.log_level)

        # Create a formatter and set it for both handlers
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)
        file_handler.setFormatter(formatter)

        # Add handlers to the logger
        self.logger.addHandler(console_handler)
        self.logger.addHandler(file_handler)

    def log_custom(self, message, level=logging.INFO):
        """Log a custom message at a specified log level."""
        self.logger.log(level, message)

    def log_structured(self, message, **kwargs):
        """Log a structured message with additional context."""
        structured_message = {
            "message": message,
            "context": kwargs
        }
        self.logger.info(json.dumps(structured_message))

    def add_socket_handler(self, host='localhost', port=9999):
        """Add a socket handler to send logs to a remote server."""
        socket_handler = SocketHandler(host, port)
        socket_handler.setLevel(self.log_level)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        socket_handler.setFormatter(formatter)
        self.logger.addHandler(socket_handler)

    def get_logger(self):
        """Return the configured logger."""
        return self.logger

# Example usage
if __name__ == "__main__":
    # Initialize the logger
    logger = Logger().get_logger()

    # Log some messages
    logger.info("This is an info message.")
    logger.warning("This is a warning message.")
    logger.error("This is an error message.")
    logger.debug("This is a debug message.")

    # Log a structured message
    logger.log_structured("User  login", user_id=123, status="success")
