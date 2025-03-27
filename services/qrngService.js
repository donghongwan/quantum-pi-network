// qrngService.js
const axios = require('axios');
const NodeCache = require('node-cache');
const winston = require('winston');

// Configure caching
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'qrngService.log' })
    ]
});

// Get QRNG API URL from environment variable or use default
const QRNG_API_URL = process.env.QRNG_API_URL || 'https://api.quantinuum.com/qrng'; // Replace with actual QRNG API URL

async function fetchQuantumTimestamp() {
    // Check if the timestamp is cached
    const cachedTimestamp = cache.get('quantumTimestamp');
    if (cachedTimestamp) {
        logger.info('Returning cached quantum timestamp');
        return cachedTimestamp;
    }

    try {
        const response = await axios.get(QRNG_API_URL);
        if (response.data && response.data.timestamp) {
            const timestamp = response.data.timestamp; // Assuming the API returns a timestamp
            // Cache the timestamp
            cache.set('quantumTimestamp', timestamp);
            logger.info('Fetched new quantum timestamp from API');
            return timestamp;
        } else {
            logger.error('Invalid response from QRNG API: ', response.data);
            throw new Error('Invalid response from QRNG API');
        }
    } catch (error) {
        logger.error('Error fetching quantum timestamp:', error.message);
        throw error; // Re-throw the error for further handling
    }
}

module.exports = { fetchQuantumTimestamp };
