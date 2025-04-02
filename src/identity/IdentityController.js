// src/controllers/IdentityController.js

const express = require('express');
const IdentityService = require('./IdentityService');
const { body, validationResult } = require('express-validator'); // For input validation
const winston = require('winston'); // For logging

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'identityController.log' })
    ]
});

class IdentityController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/create', 
            body('username').isString().notEmpty(),
            body('email').isEmail(),
            this.createIdentity.bind(this)
        );

        this.router.post('/verify', 
            body('identityId').isString().notEmpty(),
            body('signature').isString().notEmpty(),
            this.verifyIdentity.bind(this)
        );
    }

    async createIdentity(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in createIdentity:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email } = req.body;
        try {
            const identity = await IdentityService.createIdentity(username, email);
            logger.info(`Identity created: ${JSON.stringify(identity)}`);
            res.status(201).json(identity);
        } catch (error) {
            logger.error('Error creating identity:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async verifyIdentity(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in verifyIdentity:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { identityId, signature } = req.body;
        try {
            const isVerified = await IdentityService.verifyIdentity(identityId, signature);
            logger.info(`Identity verification result for ID ${identityId}: ${isVerified}`);
            res.status(200).json({ verified: isVerified });
        } catch (error) {
            logger.error('Error verifying identity:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new IdentityController().router;
