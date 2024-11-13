// src/services/apiService.js

import axios from 'axios';
import config from '../main/config';

const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to fetch user data
export const getUser Data = async (userAddress) => {
    try {
        const response = await apiClient.get(`/users/${userAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Function to submit a transaction
export const submitTransaction = async (transactionData) => {
    try {
        const response = await apiClient.post('/transactions', transactionData);
        return response.data;
    } catch (error) {
        console.error('Error submitting transaction:', error);
        throw error.response ? error.response.data : error.message;
    }
};

// Additional API functions can be added here

export default {
    getUser Data,
    submitTransaction,
};
