import requests
import pandas as pd
import os
import logging
import time
from datetime import datetime
from requests.exceptions import RequestException

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Constants
DATA_DIR = 'data'
CACHE_FILE = os.path.join(DATA_DIR, 'market_data_cache.csv')
API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd'

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def fetch_market_data():
    """Fetch market data from the API."""
    try:
        response = requests.get(API_URL)
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()
        logging.info("Market data fetched successfully.")
        return data
    except RequestException as e:
        logging.error(f"Error fetching market data: {e}")
        return None

def cache_data(data):
    """Cache the fetched data to a CSV file."""
    if data:
        df = pd.DataFrame(data)
        if os.path.exists(CACHE_FILE):
            existing_data = pd.read_csv(CACHE_FILE)
            df = pd.concat([existing_data, df], ignore_index=True).drop_duplicates()
        df.to_csv(CACHE_FILE, index=False)
        logging.info("Market data cached successfully.")

def load_cached_data():
    """Load cached data from the CSV file."""
    if os.path.exists(CACHE_FILE):
        df = pd.read_csv(CACHE_FILE)
        logging.info("Loaded cached market data.")
        return df
    else:
        logging.warning("No cached data found.")
        return pd.DataFrame()

def main():
    """Main function to fetch and cache market data."""
    while True:
        market_data = fetch_market_data()
        cache_data(market_data)
        time.sleep(300)  # Fetch data every 5 minutes

if __name__ == "__main__":
    main()
