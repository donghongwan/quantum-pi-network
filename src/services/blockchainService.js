// src/services/blockchainService.js

import Web3 from 'web3';
import config from '../main/config';
import MyContract from '../artifacts/MyContract.json'; // Import your contract's ABI
import winston from 'winston'; // For logging

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'blockchainService.log' })
    ]
});

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainUrl));
const contractAddress = process.env.CONTRACT_ADDRESS; // Set your contract address here
const myContract = new web3.eth.Contract(MyContract.abi, contractAddress);

/**
 * Get the current account.
 * @returns {Promise<string>} - The current account address.
 */
export const getCurrentAccount = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            logger.warn('No accounts found. Make sure your wallet is connected.');
            throw new Error('No accounts found');
        }
        logger.info(`Current account: ${accounts[0]}`);
        return accounts[0];
    } catch (error) {
        logger.error('Error fetching current account:', error);
        throw error.message;
    }
};

/**
 * Get data from the contract.
 * @param {string} methodName - The name of the contract method to call.
 * @param {...*} args - The arguments to pass to the contract method.
 * @returns {Promise<any>} - The data returned from the contract method.
 */
export const getContractData = async (methodName, ...args) => {
    try {
        const data = await myContract.methods[methodName](...args).call();
        logger.info(`Fetched data from contract method ${methodName}:`, data);
        return data;
    } catch (error) {
        logger.error('Error fetching contract data:', error);
        throw error.message;
    }
};

/**
 * Send a transaction to the contract.
 * @param {string} methodName - The name of the contract method to call.
 * @param {...*} args - The arguments to pass to the contract method.
 * @returns {Promise<Object>} - The transaction receipt.
 */
export const sendTransaction = async (methodName, ...args) => {
    const account = await getCurrentAccount();
    try {
        const transaction = await myContract.methods[methodName](...args).send({ from: account });
        logger.info(`Transaction sent for method ${methodName}:`, transaction);
        return transaction;
    } catch (error) {
        logger.error('Error sending transaction:', error);
        throw error.message;
    }
};

/**
 * Listen for events from the contract.
 * @param {string} eventName - The name of the event to listen for.
 * @param {function} callback - The callback function to execute when the event is received.
 */
export const listenForEvents = (eventName, callback) => {
    myContract.events[eventName]()
        .on('data', (event) => {
            logger.info('Event received:', event);
            callback(event);
        })
        .on('error', (error) => {
            logger.error('Error listening for events:', error);
        });
};

// Additional blockchain functions can be added here

export default {
    getCurrentAccount,
    getContractData,
    sendTransaction,
    listenForEvents,
};
