// src/services/apiService.js

import axios from 'axios';
import config from '../main/config';
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
        new winston.transports.File({ filename: 'apiService.log' })
    ]
});

// Create an Axios instance
const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetch user data by address.
 * @param {string} userAddress - The address of the user.
 * @returns {Promise<Object>} - The user data.
 */
export const getUser Data = async (userAddress) => {
    if (!userAddress) {
        logger.error('User  address is required to fetch user data');
        throw new Error('User  address is required');
    }

    try {
        const response = await apiClient.get(`/users/${userAddress}`);
        logger.info(`Fetched user data for address: ${userAddress}`);
        return response.data;
    } catch (error) {
        logger.error('Error fetching user data:', error);
        throw error.response ? error.response.data : error.message;
    }
};

/**
 * Submit a transaction.
 * @param {Object} transactionData - The transaction data to submit.
 * @returns {Promise<Object>} - The response from the transaction submission.
 */
export const submitTransaction = async (transactionData) => {
    if (!transactionData) {
        logger.error('Transaction data is required to submit a transaction');
        throw new Error('Transaction data is required');
    }

    try {
        const response = await apiClient.post('/transactions', transactionData);
        logger.info('Transaction submitted successfully');
        return response.data;
    } catch (error) {
        logger.error('Error submitting transaction:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Additional API functions can be added here

export default {
    getUser Data,
    submitTransaction,
};
