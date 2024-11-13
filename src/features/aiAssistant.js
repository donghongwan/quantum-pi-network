// aiAssistant.js

const axios = require('axios');

const AI_API_BASE_URL = 'https://api.aiassistant.com'; // Replace with your AI assistant's API URL

// Function to get financial advice based on user data
async function getFinancialAdvice(userData) {
    try {
        const response = await axios.post(`${AI_API_BASE_URL}/advice`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error getting financial advice: ${error}`);
        throw error;
    }
}

// Function to track expenses and provide insights
async function trackExpenses(expenseData) {
    try {
        const response = await axios.post(`${AI_API_BASE_URL}/track-expenses`, expenseData);
        return response.data;
    } catch (error) {
        console.error(`Error tracking expenses: ${error}`);
        throw error;
    }
}

// Function to set financial goals
async function setFinancialGoals(goals) {
    try {
        const response = await axios.post(`${AI_API_BASE_URL}/set-goals`, goals);
        return response.data;
    } catch (error) {
        console.error(`Error setting financial goals: ${error}`);
        throw error;
    }
}

// Function to get a summary of financial health
async function getFinancialHealthSummary(userId) {
    try {
        const response = await axios.get(`${AI_API_BASE_URL}/health-summary/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching financial health summary: ${error}`);
        throw error;
    }
}

module.exports = {
    getFinancialAdvice,
    trackExpenses,
    setFinancialGoals,
    getFinancialHealthSummary
};
