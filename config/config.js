// config.js
require('dotenv').config(); // Load environment variables from .env file

const config = {
    piNetwork: {
        apiKey: process.env.PI_NETWORK_API_KEY,
        url: process.env.PI_NETWORK_URL,
    },
};

// Validate configuration
function validateConfig() {
    if (!config.piNetwork.apiKey) {
        throw new Error("Missing PI_NETWORK_API_KEY in environment variables.");
    }
    if (!config.piNetwork.url) {
        throw new Error("Missing PI_NETWORK_URL in environment variables.");
    }
}

// Export the configuration and validation function
module.exports = {
    config,
    validateConfig,
};
