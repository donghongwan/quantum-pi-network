// src/controllers/NFTController.js

const express = require('express');
const NFTService = require('./NFTService');
const winston = require('winston'); // For logging
const { body, param, validationResult } = require('express-validator'); // For input validation

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'nftController.log' })
    ]
});

class NFTController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/create', 
            body('name').isString().notEmpty(),
            body('description').isString().optional(),
            body('owner').isString().notEmpty(),
            this.createNFT.bind(this)
        );

        this.router.get('/:nftId', 
            param('nftId').isInt(),
            this.getNFT.bind(this)
        );

        this.router.post('/transfer', 
            body('nftId').isInt(),
            body('newOwner').isString().notEmpty(),
            this.transferNFT.bind(this)
        );

        this.router.get('/list', this.listNFTs.bind(this));
    }

    async createNFT(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in createNFT:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, owner } = req.body;
        try {
            const nft = await NFTService.createNFT(name, description, owner);
            logger.info(`NFT created: ${JSON.stringify(nft)}`);
            res.status(201).json(nft);
        } catch (error) {
            logger.error('Error creating NFT:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getNFT(req, res) {
        const { nftId } = req.params;
        try {
            const nft = await NFTService.getNFT(parseInt(nftId, 10));
            logger.info(`Fetched NFT: ${JSON.stringify(nft)}`);
            res.status(200).json(nft);
        } catch (error) {
            logger.error('Error fetching NFT:', error.message);
            res.status(404).json({ error: error.message });
        }
    }

    async transferNFT(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in transferNFT:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { nftId, newOwner } = req.body;
        try {
            const nft = await NFTService.transferNFT(parseInt(nftId, 10), newOwner);
            logger.info(`NFT transferred: ${JSON.stringify(nft)}`);
            res.status(200).json(nft);
        } catch (error) {
            logger.error('Error transferring NFT:', error.message);
            res.status(404).json({ error: error.message });
        }
    }

    async listNFTs(req, res) {
        try {
            const nfts = await NFTService.listNFTs();
            logger.info('Fetched NFT list');
            res.status(200).json(nfts);
        } catch (error) {
            logger.error('Error fetching NFT list:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new NFTController().router;
