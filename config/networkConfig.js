const StellarSdk = require('stellar-sdk'); // Import Stellar SDK
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const networkConfig = {
    stellar: { // Stellar Network
        name: "Stellar Network",
        horizonUrl: process.env.STELLAR_HORIZON_URL || "https://horizon.stellar.org", // Horizon API URL
        networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE || StellarSdk.Networks.PUBLIC, // Use Stellar SDK for default passphrase
        contracts: {
            PiCoin: process.env.STELLAR_PICOIN_ADDRESS || "GYourPiCoinAccountAddress", // Stellar account address for PiCoin
            Governance: process.env.STELLAR_GOVERNANCE_ADDRESS || "GYourGovernanceAccountAddress", // Stellar account address for Governance
        },
        transactionOptions: {
            fee: process.env.STELLAR_TRANSACTION_FEE || "100", // Transaction fee in stroops
            timeout: process.env.STELLAR_TRANSACTION_TIMEOUT || 30, // Timeout for transactions in seconds
        },
    },
    local: { // Local Stellar Development
        name: "Local Stellar Development",
        horizonUrl: process.env.LOCAL_STELLAR_HORIZON_URL || "http://localhost:8000", // Local Horizon API URL
        networkPassphrase: process.env.LOCAL_STELLAR_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET, // Local network passphrase
        contracts: {
            PiCoin: process.env.LOCAL_STELLAR_PICOIN_ADDRESS || "GYourLocalPiCoinAccountAddress", // Local Stellar account address for PiCoin
            Governance: process.env.LOCAL_STELLAR_GOVERNANCE_ADDRESS || "GYourLocalGovernanceAccountAddress", // Local Stellar account address for Governance
        },
        transactionOptions: {
            fee: process.env.LOCAL_STELLAR_TRANSACTION_FEE || "100", // Local transaction fee in stroops
            timeout: process.env.LOCAL_STELLAR_TRANSACTION_TIMEOUT || 30, // Local transaction timeout
        },
    },
    // Additional networks can be added here
    testnet: { // Stellar Testnet
        name: "Stellar Testnet",
        horizonUrl: process.env.TESTNET_HORIZON_URL || "https://horizon-testnet.stellar.org", // Testnet Horizon API URL
        networkPassphrase: process.env.TESTNET_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET, // Testnet passphrase
        contracts: {
            PiCoin: process.env.TESTNET_PICOIN_ADDRESS || "GYourTestnetPiCoinAccountAddress", // Testnet account address for PiCoin
            Governance: process.env.TESTNET_GOVERNANCE_ADDRESS || "GYourTestnetGovernanceAccountAddress", // Testnet account address for Governance
        },
        transactionOptions: {
            fee: process.env.TESTNET_TRANSACTION_FEE || "100", // Testnet transaction fee in stroops
            timeout: process.env.TESTNET_TRANSACTION_TIMEOUT || 30, // Testnet transaction timeout
        },
    },
};

const getNetworkConfig = (network) => {
    const config = networkConfig[network];
    if (!config) {
        throw new Error(`Network ${network} is not supported.`);
    }
    return config;
};

// Function to validate Stellar account addresses
const validateAccountAddress = (address) => {
    try {
        StellarSdk.StrKey.checkAddress(address);
        return true;
    } catch (error) {
        return false;
    }
};

// Validate contract addresses
Object.values(networkConfig).forEach((network) => {
    if (!validateAccountAddress(network.contracts.PiCoin)) {
        console.warn(`Invalid PiCoin address for ${network.name}: ${network.contracts.PiCoin}`);
    }
    if (!validateAccountAddress(network.contracts.Governance)) {
        console.warn(`Invalid Governance address for ${network.name}: ${network.contracts.Governance}`);
    }
});

module.exports = {
    networkConfig,
    getNetworkConfig,
};
