// iotService.js

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
        new winston.transports.File({ filename: 'iotService.log' })
    ]
});

// IoT API base URL from environment variables
const IOT_API_BASE_URL = process.env.IOT_API_BASE_URL || 'https://api.iotplatform.com'; // Replace with your IoT platform's API URL

/**
 * Get the status of a specific IoT device.
 * @param {string} deviceId - The ID of the device.
 * @returns {Promise<Object>} - The status of the device.
 */
async function getDeviceStatus(deviceId) {
    if (!deviceId) {
        logger.error('Device ID is required to fetch device status');
        throw new Error('Device ID is required');
    }

    try {
        const response = await axios.get(`${IOT_API_BASE_URL}/devices/${deviceId}/status`);
        logger.info(`Fetched status for device ${deviceId}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching device status: ${error.message}`);
        throw error.response ? error.response.data : error.message;
    }
}

/**
 * Send a command to a specific IoT device.
 * @param {string} deviceId - The ID of the device.
 * @param {Object} command - The command to send.
 * @returns {Promise<Object>} - The response from the device.
 */
async function sendDeviceCommand(deviceId, command) {
    if (!deviceId || !command) {
        logger.error('Device ID and command are required to send a command');
        throw new Error('Device ID and command are required');
    }

    try {
        const response = await axios.post(`${IOT_API_BASE_URL}/devices/${deviceId}/command`, { command });
        logger.info(`Sent command to device ${deviceId}:`, command);
        return response.data;
    } catch (error) {
        logger.error(`Error sending command to device: ${error.message}`);
        throw error.response ? error.response.data : error.message;
    }
}

/**
 * Get data from a specific IoT device.
 * @param {string} deviceId - The ID of the device.
 * @returns {Promise<Object>} - The data from the device.
 */
async function getDeviceData(deviceId) {
    if (!deviceId) {
        logger.error('Device ID is required to fetch device data');
        throw new Error('Device ID is required');
    }

    try {
        const response = await axios.get(`${IOT_API_BASE_URL}/devices/${deviceId}/data`);
        logger.info(`Fetched data for device ${deviceId}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching device data: ${error.message}`);
        throw error.response ? error.response.data : error.message;
    }
}

/**
 * Register a new IoT device.
 * @param {Object} deviceInfo - The information of the device to register.
 * @returns {Promise<Object>} - The response from the registration.
 */
async function registerDevice(deviceInfo) {
    if (!deviceInfo) {
        logger.error('Device information is required to register a device');
        throw new Error('Device information is required');
    }

    try {
        const response = await axios.post(`${IOT_API_BASE_URL}/devices`, deviceInfo);
        logger.info(`Registered new device: ${deviceInfo.name || deviceInfo.id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error registering device: ${error.message}`);
        throw error.response ? error.response.data : error.message;
    }
}

/**
 * Update device settings.
 * @param {string} deviceId - The ID of the device.
 * @param {Object} settings - The settings to update.
 * @returns {Promise<Object>} - The response from the update.
 */
async function updateDeviceSettings(deviceId, settings) {
    if (!deviceId || !settings) {
        logger.error('Device ID and settings are required to update device settings');
        throw new Error('Device ID and settings are required');
    }

    try {
        const response = await axios.put(`${IOT_API_BASE_URL}/devices/${deviceId}/settings`, settings);
        logger.info(`Updated settings for device ${deviceId}`);
        return response.data;
    } catch (error) {
        logger.error(`Error updating device settings: ${error.message}`);
        throw error.response ? error.response.data : error.message;
    }
}

module.exports = {
    getDeviceStatus,
    sendDeviceCommand,
    getDeviceData,
    registerDevice,
    updateDeviceSettings
};
