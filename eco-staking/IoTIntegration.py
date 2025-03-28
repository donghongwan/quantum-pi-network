import requests
import time
import random
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configuration
API_ENDPOINT = "http://localhost:5000/api/iot-data"  # Change to your API endpoint
PROJECTS = ["Tree Planting", "Renewable Energy", "Water Conservation", "Wildlife Protection"]
MIN_AMOUNT = 1  # Minimum contribution amount
MAX_AMOUNT = 10  # Maximum contribution amount
SEND_INTERVAL = 5  # Time interval between sending data (in seconds)

def generate_iot_data():
    """Generate random IoT data for environmental projects."""
    project = random.choice(PROJECTS)
    amount = random.randint(MIN_AMOUNT, MAX_AMOUNT)
    return {
        "project": project,
        "amount": amount
    }

def send_iot_data():
    """Send IoT data to the Eco Staking API."""
    while True:
        data = generate_iot_data()
        try:
            response = requests.post(API_ENDPOINT, json=data)
            response.raise_for_status()  # Raise an error for bad responses
            logging.info(f"Sent data: {data}, Response: {response.status_code}, Message: {response.json()}")
        except requests.exceptions.RequestException as e:
            logging.error(f"Error sending data: {e}")
        except json.JSONDecodeError:
            logging.error("Failed to decode JSON response.")
        
        time.sleep(SEND_INTERVAL)  # Send data every SEND_INTERVAL seconds

if __name__ == "__main__":
    logging.info("Starting IoT Integration...")
    send_iot_data()
