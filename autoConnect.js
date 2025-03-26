// Import required libraries
const axios = require('axios');
require('dotenv').config();

// Function to connect to the Pi Network
async function connectToPiNetwork() {
    try {
        const response = await axios.get(`${process.env.PI_NETWORK_URL}/api/connect`, {
            headers: {
                'Authorization': `Bearer ${process.env.PI_NETWORK_API_KEY}`
            }
        });
        console.log('Connected to Pi Network:', response.data);
        return true; // Return true if connected successfully
    } catch (error) {
        console.error('Error connecting to Pi Network:', error.response ? error.response.data : error.message);
        return false; // Return false if connection failed
    }
}

// Auto-reconnect logic with retry mechanism
async function autoReconnect(retries = process.env.RETRY_COUNT || 5, delay = process.env.RETRY_DELAY || 5000) {
    retries = parseInt(retries, 10);
    delay = parseInt(delay, 10);

    for (let i = 0; i < retries; i++) {
        console.log(`Attempting to connect to Pi Network... (Attempt ${i + 1})`);
        const isConnected = await connectToPiNetwork();
        
        if (isConnected) {
            console.log('Successfully connected to Pi Network!');
            return; // Exit if connected successfully
        }

        // Wait before retrying
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    console.error('Failed to connect to Pi Network after multiple attempts.');
}

// Start the auto-reconnect process
autoReconnect();
