// config/environment.js

require('dotenv').config();

const environment = {
    PORT: process.env.PORT || 3000,
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    BLOCKCHAIN_URL: process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:8545',
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    PICOIN_ADDRESS: process.env.PICOIN_ADDRESS || '',
    GOVERNANCE_ADDRESS: process.env.GOVERNANCE_ADDRESS || '',
};

module.exports = environment;
