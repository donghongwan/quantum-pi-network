const express = require('express');
const AnalyticsService = require('./AnalyticsService');

class AnalyticsController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/run', this.runAnalytics.bind(this));
        this.router.get('/historical', this.getHistoricalData.bind(this));
    }

    async runAnalytics(req, res) {
        const { data } = req.body;
        try {
            const predictions = await AnalyticsService.runAnalytics(data);
            res.status(200).json(predictions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHistoricalData(req, res) {
        try {
            const historicalData = await AnalyticsService.getHistoricalData();
            res.status(200).json(historicalData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AnalyticsController().router;
