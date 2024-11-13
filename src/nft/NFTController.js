const express = require('express');
const NFTService = require('./NFTService');

class NFTController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/create', this.createNFT.bind(this));
        this.router.get('/:nftId', this.getNFT.bind(this));
        this.router.post('/transfer', this.transferNFT.bind(this));
        this.router.get('/list', this.listNFTs.bind(this));
    }

    async createNFT(req, res) {
        const { name, description, owner } = req.body;
        try {
            const nft = NFTService.createNFT(name, description, owner);
            res.status(201).json(nft);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getNFT(req, res) {
        const { nftId } = req.params;
        try {
            const nft = NFTService.getNFT(parseInt(nftId, 10));
            res.status(200).json(nft);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async transferNFT(req, res) {
        const { nftId, newOwner } = req.body;
        try {
            const nft = NFTService.transferNFT(parseInt(nftId, 10), newOwner);
            res.status(200).json(nft);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async listNFTs(req, res) {
        try {
            const nfts = NFTService.listNFTs();
            res.status(200).json(nfts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new NFTController().router;
