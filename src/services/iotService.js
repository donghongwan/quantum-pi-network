// iotService.js

const axios = require('axios');

const IOT_API_BASE_URL = 'https://api.iotplatform.com'; // Replace with your IoT platform's API URL

// Function to get the status of a specific IoT device
async function getDeviceStatus(deviceId) {
    try {
        const response = await axios.get(`${IOT_API_BASE_URL}/devices/${deviceId}/status`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching device status: ${error}`);
        throw error;
    }
}

// Function to send a command to a specific IoT device
async function sendDeviceCommand(deviceId, command) {
    try {
        const response = await axios.post(`${IOT_API_BASE_URL}/devices/${deviceId}/command`, { command });
        return response.data;
    } catch (error) {
        console.error(`Error sending command to device: ${error}`);
        throw error;
    }
}

// Function to get data from a specific IoT device
async function getDeviceData(deviceId) {
    try {
        const response = await axios.get(`${IOT_API_BASE_URL}/devices/${deviceId}/data`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching device data: ${error}`);
        throw error;
    }
}

// Function to register a new IoT device
async function registerDevice(deviceInfo) {
    try {
        const response = await axios.post(`${IOT_API_BASE_URL}/devices`, deviceInfo);
        return response.data;
    } catch (error) {
        console.error(`Error registering device: ${error}`);
        throw error;
    }
}

// Function to update device settings
async function updateDeviceSettings(deviceId, settings) {
    try {
        const response = await axios.put(`${IOT_API_BASE_URL}/devices/${deviceId}/settings`, settings);
        return response.data;
    } catch (error) {
        console.error(`Error updating device settings: ${error}`);
        throw error;
    }
}

module.exports = {
    getDeviceStatus,
    sendDeviceCommand,
    getDeviceData,
    registerDevice,
    updateDeviceSettings
};
