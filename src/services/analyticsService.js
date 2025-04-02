// analyticsService.js

const axios = require('axios');
const winston = require('winston'); // For logging
require('dotenv').config(); // For environment variable management

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'analyticsService.log' })
    ]
});

// Analytics API base URL from environment variables
const ANALYTICS_API_BASE_URL = process.env.ANALYTICS_API_BASE_URL || 'https://api.analyticsplatform.com'; // Replace with your analytics platform's API URL

/**
 * Analyze IoT data for predictive analytics.
 * @param {string} deviceId - The ID of the IoT device.
 * @param {Object} data - The data to analyze.
 * @returns {Promise<Object>} - The analysis result.
 */
async function analyzeIoTData(deviceId, data) {
    if (!deviceId || !data) {
        logger.error('Device ID and data are required for analysis');
        throw new Error('Device ID and data are required');
    }

    try {
        const response = await axios.post(`${ANALYTICS_API_BASE_URL}/predictive-analysis`, {
            deviceId,
            data
        });
        logger.info(`IoT data analyzed for device ${deviceId}`);
        return response.data;
    } catch (error) {
        logger.error(`Error analyzing IoT data: ${error.message}`);
        throw error;
    }
}

/**
 * Detect fraud based on historical data.
 * @param {string} deviceId - The ID of the IoT device.
 * @param {Object} transactionData - The transaction data to analyze.
 * @returns {Promise<Object>} - The fraud detection result.
 */
async function detectFraud(deviceId, transactionData) {
    if (!deviceId || !transactionData) {
        logger.error('Device ID and transaction data are required for fraud detection');
        throw new Error('Device ID and transaction data are required');
    }

    try {
        const response = await axios.post(`${ANALYTICS_API_BASE_URL}/fraud-detection`, {
            deviceId,
            transactionData
        });
        logger.info(`Fraud detection performed for device ${deviceId}`);
        return response.data;
    } catch (error) {
        logger.error(`Error detecting fraud: ${error.message}`);
        throw error;
    }
}

/**
 * Get historical analytics data for a specific device.
 * @param {string} deviceId - The ID of the IoT device.
 * @returns {Promise<Object>} - The historical data.
 */
async function getHistoricalData(deviceId) {
    if (!deviceId) {
        logger.error('Device ID is required to fetch historical data');
        throw new Error('Device ID is required');
    }

    try {
        const response = await axios.get(`${ANALYTICS_API_BASE_URL}/devices/${deviceId}/historical-data`);
        logger.info(`Fetched historical data for device ${deviceId}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching historical data: ${error.message}`);
        throw error;
    }
}

/**
 * Generate reports based on analytics.
 * @param {string} deviceId - The ID of the IoT device.
 * @param {string} reportType - The type of report to generate.
 * @returns {Promise<Object>} - The generated report.
 */
async function generateReport(deviceId, reportType) {
    if (!deviceId || !reportType) {
        logger.error('Device ID and report type are required to generate a report');
        throw new Error('Device ID and report type are required');
    }

    try {
        const response = await axios.post(`${ANALYTICS_API_BASE_URL}/generate-report`, {
            deviceId,
            reportType
        });
        logger.info(`Generated report for device ${deviceId} of type ${reportType}`);
        return response.data;
    } catch (error) {
        logger.error(`Error generating report: ${error.message}`);
        throw error;
    }
}

module.exports = {
    analyzeIoTData,
    detectFraud,
    getHistoricalData,
    generateReport
};
