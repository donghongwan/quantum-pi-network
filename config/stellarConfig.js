// config/stellarConfig.js

const StellarSdk = require('stellar-sdk');

// Configuration for Stellar network integration
const stellarConfig = {
    network: {
        // Use the public Stellar network
        horizonUrl: 'https://horizon.stellar.org',
        networkPassphrase: StellarSdk.Networks.PUBLIC,
    },
    keypair: {
        // Replace with your actual secret key
        secret: 'YOUR_SECRET_KEY', // This should be kept secure
        public: null, // Will be generated from the secret key
    },
    options: {
        // Additional options can be added here
        fee: StellarSdk.BASE_FEE, // Default transaction fee
        timeout: 30, // Transaction timeout in seconds
    },
};

// Generate the public key from the secret key
stellarConfig.keypair.public = StellarSdk.Keypair.fromSecret(stellarConfig.keypair.secret).publicKey();

// Export the configuration
module.exports = stellarConfig;
