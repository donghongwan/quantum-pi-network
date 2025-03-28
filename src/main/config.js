// main/config.js

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    blockchainUrl: process.env.BLOCKCHAIN_URL || 'http://localhost:8545',
    dbConnectionString: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/mydb',
    apiKey: process.env.API_KEY || 'your-api-key-here',
};
