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
    } catch (error) {
        console.error('Error connecting to Pi Network:', error.message);
    }
}

// Auto-reconnect logic
async function autoReconnect(retries = 5) {
    for (let i = 0; i < retries; i++) {
        console.log(`Attempting to connect to Pi Network... (Attempt ${i + 1})`);
        await connectToPiNetwork();
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// Monitor connection status
setInterval(() => {
    console.log('Checking connection status...');
    // Logic to check connection status can be implemented here
    // If disconnected, call autoReconnect()
}, 60000); // Check every minute

// Start the auto-reconnect process
autoReconnect();
