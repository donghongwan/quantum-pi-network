// tests/unit/analytics.test.js

const analyticsService = require('../../src/service/analyticsService');
const axios = require('axios');

// Mock the axios module
jest.mock('axios');

describe('Analytics Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('analyzeIoTData should return analysis results', async () => {
        const mockData = { deviceId: '123', data: { temperature: 22 } };
        const mockResponse = { data: { prediction: 'normal' } };

        axios.post.mockResolvedValue(mockResponse);

        const result = await analyticsService.analyzeIoTData(mockData.deviceId, mockData.data);
        expect(result).toEqual(mockResponse.data);
        expect(axios.post).toHaveBeenCalledWith('https://api.analyticsplatform.com/predictive-analysis', mockData);
    });

    test('detectFraud should return fraud detection results', async () => {
        const mockData = { deviceId: '123', transactionData: { amount: 100 } };
        const mockResponse = { data: { isFraud: false } };

        axios.post.mockResolvedValue(mockResponse);

        const result = await analyticsService.detectFraud(mockData.deviceId, mockData.transactionData);
        expect(result).toEqual(mockResponse.data);
        expect(axios.post).toHaveBeenCalledWith('https://api.analyticsplatform.com/fraud-detection', mockData);
    });

    test('getHistoricalData should return historical data', async () => {
        const mockDeviceId = '123';
        const mockResponse = { data: [{ timestamp: '2023-01-01', value: 50 }] };

        axios.get.mockResolvedValue(mockResponse);

        const result = await analyticsService.getHistoricalData(mockDeviceId);
        expect(result).toEqual(mockResponse.data);
        expect(axios.get).toHaveBeenCalledWith('https://api.analyticsplatform.com/devices/123/historical-data');
    });

    test('generateReport should return report data', async () => {
        const mockData = { deviceId: '123', reportType: 'monthly' };
        const mockResponse = { data: { report: 'Monthly Report Data' } };

        axios.post.mockResolvedValue(mockResponse);

        const result = await analyticsService.generateReport(mockData.deviceId, mockData.reportType);
        expect(result).toEqual(mockResponse.data);
        expect(axios.post).toHaveBeenCalledWith('https://api.analyticsplatform.com/generate-report', mockData);
    });

    test('analyzeIoTData should throw an error on failure', async () => {
        const mockData = { deviceId: '123', data: { temperature: 22 } };
        axios.post.mockRejectedValue(new Error('Network Error'));

        await expect(analyticsService.analyzeIoTData(mockData.deviceId, mockData.data)).rejects.toThrow('Network Error');
    });
});
