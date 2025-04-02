// src/services/NFTService.js

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
        new winston.transports.File({ filename: 'nftService.log' })
    ]
});

class NFTService {
    constructor() {
        this.nfts = new Map(); // In-memory storage for NFTs
        this.currentId = 1; // Simple ID counter for NFTs
    }

    /**
     * Create a new NFT.
     * @param {string} name - The name of the NFT.
     * @param {string} description - The description of the NFT.
     * @param {string} owner - The owner of the NFT.
     * @returns {Object} - The created NFT.
     */
    createNFT(name, description, owner) {
        if (!name || !owner) {
            logger.error('Name and owner are required to create an NFT');
            throw new Error('Name and owner are required');
        }

        const nftId = this.currentId++;
        const nft = {
            id: nftId,
            name,
            description,
            owner,
            createdAt: new Date(),
            status: 'available',
        };

        this.nfts.set(nftId, nft);
        logger.info(`NFT created: ${JSON.stringify(nft)}`);
        return nft;
    }

    /**
     * Get an NFT by its ID.
     * @param {number} nftId - The ID of the NFT.
     * @returns {Object} - The NFT.
     */
    getNFT(nftId) {
        const nft = this.nfts.get(nftId);
        if (!nft) {
            logger.error(`NFT not found: ID ${nftId}`);
            throw new Error('NFT not found');
        }
        logger.info(`Fetched NFT: ${JSON.stringify(nft)}`);
        return nft;
    }

    /**
     * Transfer ownership of an NFT.
     * @param {number} nftId - The ID of the NFT.
     * @param {string} newOwner - The new owner's address.
     * @returns {Object} - The updated NFT.
     */
    transferNFT(nftId, newOwner) {
        const nft = this.nfts.get(nftId);
        if (!nft) {
            logger.error(`NFT not found for transfer: ID ${nftId}`);
            throw new Error('NFT not found');
        }
        nft.owner = newOwner;
        logger.info(`NFT transferred: ID ${nftId}, New Owner: ${newOwner}`);
        return nft;
    }

    /**
     * List all NFTs.
     * @returns {Array} - An array of NFTs.
     */
    listNFTs() {
        const nftList = Array.from(this.nfts.values());
        logger.info(`Fetched NFT list: ${nftList.length} items`);
        return nftList;
    }
}

module.exports = new NFTService();
