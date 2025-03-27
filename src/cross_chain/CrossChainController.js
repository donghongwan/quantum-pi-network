const express = require('express');
const CrossChainService = require('./CrossChainService');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

class CrossChainController {
    constructor() {
        this.router = express.Router();
        this.initializeLogging();
        this.initializeRoutes();
    }

    // Configure logging
    initializeLogging() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'crossChainController.log' })
            ]
        });
    }

    // Initialize routes
    initializeRoutes() {
        const limiter = rateLimit({
            windowMs: 1 * 60 * 1000, // 1 minute
            max: 100, // Limit each IP to 100 requests per windowMs
            message: 'Too many requests, please try again later.'
        });

        this.router.post('/initiate', limiter, this.initiateTransaction.bind(this));
        this.router.get('/status/:transactionId', limiter, this.getTransactionStatus.bind(this));
    }

    // Validate request body for initiating a transaction
    validateInitiateTransactionRequest(req) {
        const { fromChain, toChain, amount, asset } = req.body;
        if (!fromChain || !toChain || !amount || !asset) {
            throw new Error('Missing required fields: fromChain, toChain, amount, asset');
        }
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount: must be a positive number.');
        }
    }

    // Initiate a cross-chain transaction
    async initiateTransaction(req, res) {
        try {
            this.validateInitiateTransactionRequest(req);
            const { fromChain, toChain, amount, asset } = req.body;
            const transaction = await CrossChainService.initiateTransaction({ fromChain, toChain, amount, asset });
            this.logger.info(`Transaction initiated: ${transaction.id}`, transaction);
            res.status(201).json(transaction);
        } catch (error) {
            this.logger.error('Error initiating transaction:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Get the status of a transaction
    async getTransactionStatus(req, res) {
        const { transactionId } = req.params;
        try {
            const transaction = CrossChainService.getTransactionStatus(transactionId);
            this.logger.info(`Transaction status retrieved: ${transactionId}`, transaction);
            res.status(200).json(transaction);
        } catch (error) {
            this.logger.error('Error retrieving transaction status:', error.message);
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new CrossChainController().router;
