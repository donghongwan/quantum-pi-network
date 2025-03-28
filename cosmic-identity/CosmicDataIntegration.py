import requests
import logging
import json
import os
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)

# Caching mechanism
COSMIC_DATA_CACHE = {}
CACHE_EXPIRY = timedelta(hours=1)  # Cache expiry time

def fetch_nasa_data():
    """Fetch cosmic data from NASA API."""
    try:
        response = requests.get('https://api.le-systeme-solaire.net/rest/bodies/')
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching data from NASA: {e}")
        return None

def fetch_esa_data():
    """Fetch cosmic data from ESA API."""
    try:
        response = requests.get('https://api.esa.int/space-in-images/Images')
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching data from ESA: {e}")
        return None

def process_cosmic_data(data):
    """Process cosmic data to extract relevant information."""
    processed_data = []
    if data:
        for body in data.get('bodies', []):
            if 'mass' in body and 'englishName' in body:
                processed_data.append({
                    'name': body['englishName'],
                    'mass': body['mass']['massValue'],  # Mass in kg
                    'density': body.get('density', 'N/A'),  # Density if available
                    'gravity': body.get('gravity', 'N/A'),  # Gravity if available
                })
    return processed_data

def get_cosmic_data():
    """Fetch and return cosmic data from APIs, using cache if available."""
    current_time = datetime.now()

    # Check if cached data is available and not expired
    if 'nasa_data' in COSMIC_DATA_CACHE and COSMIC_DATA_CACHE['nasa_data']['timestamp'] > current_time - CACHE_EXPIRY:
        logging.info("Using cached NASA data.")
        nasa_data = COSMIC_DATA_CACHE['nasa_data']['data']
    else:
        logging.info("Fetching new NASA data.")
        nasa_data = fetch_nasa_data()
        COSMIC_DATA_CACHE['nasa_data'] = {'data': nasa_data, 'timestamp': current_time}

    if 'esa_data' in COSMIC_DATA_CACHE and COSMIC_DATA_CACHE['esa_data']['timestamp'] > current_time - CACHE_EXPIRY:
        logging.info("Using cached ESA data.")
        esa_data = COSMIC_DATA_CACHE['esa_data']['data']
    else:
        logging.info("Fetching new ESA data.")
        esa_data = fetch_esa_data()
        COSMIC_DATA_CACHE['esa_data'] = {'data': esa_data, 'timestamp': current_time}

    # Process and combine data
    processed_nasa_data = process_cosmic_data(nasa_data)
    processed_esa_data = process_cosmic_data(esa_data)

    return {
        'nasa_data': processed_nasa_data,
        'esa_data': processed_esa_data
    }

if __name__ == "__main__":
    cosmic_data = get_cosmic_data()
    logging.info("Cosmic Data Retrieved:")
    logging.info(json.dumps(cosmic_data, indent=2))
