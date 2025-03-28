// src/main/utils/helpers.js

const Web3 = require('web3');
const mongoose = require('mongoose');

let web3;

async function connectToBlockchain(url) {
    try {
        web3 = new Web3(new Web3.providers.HttpProvider(url));
        console.log('Connected to the blockchain at:', url);
    } catch (error) {
        console.error('Failed to connect to the blockchain:', error);
    }
}

async function connectToDatabase(connectionString) {
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

function handleError(error) {
    console.error('An error occurred:', error);
    // Additional error handling logic can be added here
}

module.exports = {
    connectToBlockchain,
    connectToDatabase,
    handleError,
};
