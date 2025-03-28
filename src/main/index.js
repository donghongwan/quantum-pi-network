// src/main/index.js

const express = require('express');
const bodyParser = require('body-parser');
const { connectToBlockchain } = require('./utils/helpers');
const config = require('./config');

const app = express();
const PORT = config.port || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to the blockchain
connectToBlockchain(config.blockchainUrl);

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Advanced dApp!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
