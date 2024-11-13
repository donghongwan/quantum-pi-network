const express = require('express');
const IdentityService = require('./IdentityService');

class IdentityController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/create', this.createIdentity.bind(this));
        this.router.post('/verify', this.verifyIdentity.bind(this));
    }

    async createIdentity(req, res) {
        const { username, email } = req.body;
        try {
            const identity = await IdentityService.createIdentity(username, email);
            res.status(201).json(identity);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async verifyIdentity(req, res) {
        const { identityId, signature } = req.body;
        try {
            const isVerified = await IdentityService.verifyIdentity(identityId, signature);
            res.status(200).json({ verified: isVerified });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new IdentityController().router;
