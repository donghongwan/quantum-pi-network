import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')  # Change this in production
    DEBUG = os.getenv('DEBUG', 'False').lower() in ['true', '1', 't']
    TESTING = os.getenv('TESTING', 'False').lower() in ['true', '1', 't']
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///transactions.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = 'Content-Type'
    
    # Celery Configuration
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    
    # Logging Configuration
    LOGGING_LEVEL = os.getenv('LOGGING_LEVEL', 'INFO')
    LOGGING_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Security Settings
    SESSION_COOKIE_SECURE = True  # Use secure cookies
    SESSION_COOKIE_HTTPONLY = True  # Prevent JavaScript access to session cookies
    SESSION_COOKIE_SAMESITE = 'Lax'  # CSRF protection
    REMEMBER_COOKIE_SECURE = True  # Secure remember me cookies

    # API Rate Limiting
    RATE_LIMIT = os.getenv('RATE_LIMIT', '100 per hour')  # Example rate limit

    # Machine Learning Model Configuration
    ML_MODEL_PATH = os.getenv('ML_MODEL_PATH', 'models/transaction_model.pkl')
    ML_MODEL_THRESHOLD = float(os.getenv('ML_MODEL_THRESHOLD', 0.75))  # Threshold for predictions

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DEV_DATABASE_URI', 'sqlite:///dev_transactions.db')

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URI', 'sqlite:///test_transactions.db')

class ProductionConfig(Config):
    """Production configuration."""
    SQLALCHEMY_DATABASE_URI = os.getenv('PROD_DATABASE_URI', 'postgresql://user:password@localhost/prod_db')
    DEBUG = False

# Configuration mapping
config_mapping = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
}

def get_config():
    """Get the appropriate configuration based on the environment."""
    env = os.getenv('FLASK_ENV', 'development')
    return config_mapping.get(env, DevelopmentConfig)
