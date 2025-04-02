// src/utils/NFTUtils.js

const crypto = require('crypto'); // For generating unique identifiers
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
        new winston.transports.File({ filename: 'nftUtils.log' })
    ]
});

class NFTUtils {
    /**
     * Validate NFT data.
     * @param {string} name - The name of the NFT.
     * @param {string} owner - The owner of the NFT.
     * @returns {boolean} - True if valid, otherwise false.
     */
    validateNFTData(name, owner) {
        const isValid = typeof name === 'string' && name.trim() !== '' && typeof owner === 'string' && owner.trim() !== '';
        if (!isValid) {
            logger.error('Invalid NFT data: Name and owner must be non-empty strings');
        }
        return isValid;
    }

    /**
     * Generate a unique identifier for an NFT.
     * @returns {string} - A unique identifier.
     */
    generateUniqueId() {
        return crypto.randomBytes(16).toString('hex');
    }

    /**
     * Format NFT information for display.
     * @param {Object} nft - The NFT object.
     * @returns {string} - Formatted NFT information.
     */
    formatNFTInfo(nft) {
        return `NFT ID: ${nft.id}\nName: ${nft.name}\nDescription: ${nft.description || 'N/A'}\nOwner: ${nft.owner}\nCreated At: ${nft.createdAt.toISOString()}\nStatus: ${nft.status}`;
    }

    // Additional utility functions can be added here
}

module.exports = new NFTUtils();
