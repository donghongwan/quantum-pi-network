const express = require('express');
const CrossChainService = require('./CrossChainService');

class CrossChainController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/initiate', this.initiateTransaction.bind(this));
        this.router.get('/status/:transactionId', this.getTransactionStatus.bind(this));
    }

    async initiateTransaction(req, res) {
        const { fromChain, toChain, amount, asset } = req.body;
        try {
            const transaction = await CrossChainService.initiateTransaction({ fromChain, toChain, amount, asset });
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTransactionStatus(req, res) {
        const { transactionId } = req.params;
        try {
            const transaction = CrossChainService.getTransactionStatus(transactionId);
            res.status(200).json(transaction);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new CrossChainController().router;
