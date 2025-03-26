const StellarSdk = require('stellar-sdk');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configuration for Stellar network integration
const stellarConfig = {
    network: {
        // Use the public Stellar network or a test network based on environment variable
        horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon.stellar.org',
        networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE || StellarSdk.Networks.PUBLIC,
    },
    keypair: {
        // Secret key should be stored securely in environment variables
        secret: process.env.STELLAR_SECRET_KEY || 'YOUR_SECRET_KEY', // This should be kept secure
        public: null, // Will be generated from the secret key
    },
    options: {
        // Additional options can be added here
        fee: process.env.STELLAR_TRANSACTION_FEE || StellarSdk.BASE_FEE, // Default transaction fee
        timeout: parseInt(process.env.STELLAR_TRANSACTION_TIMEOUT) || 30, // Transaction timeout in seconds
    },
};

// Generate the public key from the secret key
try {
    stellarConfig.keypair.public = StellarSdk.Keypair.fromSecret(stellarConfig.keypair.secret).publicKey();
} catch (error) {
    console.error("Invalid secret key provided. Please check your configuration.");
    process.exit(1); // Exit the application if the secret key is invalid
}

// Export the configuration
module.exports = stellarConfig;
