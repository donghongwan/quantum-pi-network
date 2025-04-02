// syntheticAssets.js

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
        new winston.transports.File({ filename: 'syntheticAssets.log' })
    ]
});

const syntheticAssets = {};

class SyntheticAsset {
    constructor(name, underlyingAsset, price) {
        this.name = name;
        this.underlyingAsset = underlyingAsset;
        this.price = price;
        this.totalSupply = 0;
        this.priceHistory = []; // Track price history
    }

    mint(amount) {
        if (amount <= 0) {
            logger.error('Mint amount must be greater than zero');
            throw new Error('Mint amount must be greater than zero');
        }
        this.totalSupply += amount;
        logger.info(`Minted ${amount} of ${this.name}. Total supply: ${this.totalSupply}`);
    }

    burn(amount) {
        if (amount > this.totalSupply) {
            logger.error('Insufficient supply to burn');
            throw new Error('Insufficient supply to burn');
        }
        this.totalSupply -= amount;
        logger.info(`Burned ${amount} of ${this.name}. Total supply: ${this.totalSupply}`);
    }

    updatePrice(newPrice) {
        if (newPrice <= 0) {
            logger.error('New price must be greater than zero');
            throw new Error('New price must be greater than zero');
        }
        this.priceHistory.push(this.price); // Store the old price
        this.price = newPrice;
        logger.info(`Updated price of ${this.name} to ${this.price}`);
    }

    getPriceHistory() {
        return this.priceHistory;
    }
}

// Function to create a new synthetic asset
function createSyntheticAsset(name, underlyingAsset, price) {
    if (syntheticAssets[name]) {
        logger.error(`Synthetic asset ${name} already exists`);
        throw new Error(`Synthetic asset ${name} already exists`);
    }
    const asset = new SyntheticAsset(name, underlyingAsset, price);
    syntheticAssets[name] = asset;
    logger.info(`Created synthetic asset: ${name}`);
    return asset;
}

// Function to get a synthetic asset by name
function getSyntheticAsset(name) {
    const asset = syntheticAssets[name];
    if (!asset) {
        logger.error(`Synthetic asset ${name} not found`);
        throw new Error(`Synthetic asset ${name} not found`);
    }
    return asset;
}

// Function to list all synthetic assets
function listSyntheticAssets() {
    return Object.keys(syntheticAssets).map(name => ({
        name,
        totalSupply: syntheticAssets[name].totalSupply,
        price: syntheticAssets[name].price
    }));
}

module.exports = {
    createSyntheticAsset,
    getSyntheticAsset,
    listSyntheticAssets
};
