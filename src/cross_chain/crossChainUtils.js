const { createHash } = require('crypto');
const winston = require('winston');

class CrossChainUtils {
    constructor() {
        // Configure logging
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'crossChainUtils.log' })
            ]
        });
    }

    /**
     * @dev Generate a unique transaction ID for cross-chain transactions.
     * @param {string} fromChain - The source blockchain.
     * @param {string} toChain - The destination blockchain.
     * @param {number} amount - The amount to be transferred.
     * @param {string} asset - The asset being transferred.
     * @return {string} - The generated transaction ID.
     */
    generateTransactionId(fromChain, toChain, amount, asset) {
        // Validate inputs
        this.validateInputs(fromChain, toChain, amount, asset);

        const hash = createHash('sha256');
        const timestamp = Date.now();
        hash.update(`${fromChain}:${toChain}:${amount}:${asset}:${timestamp}`);
        const transactionId = hash.digest('hex');

        this.logger.info(`Generated transaction ID: ${transactionId}`, {
            fromChain,
            toChain,
            amount,
            asset,
            timestamp
        });

        return transactionId;
    }

    /**
     * @dev Validate the inputs for transaction ID generation.
     * @param {string} fromChain - The source blockchain.
     * @param {string} toChain - The destination blockchain.
     * @param {number} amount - The amount to be transferred.
     * @param {string} asset - The asset being transferred.
     */
    validateInputs(fromChain, toChain, amount, asset) {
        if (typeof fromChain !== 'string' || fromChain.trim() === '') {
            throw new Error('Invalid fromChain: must be a non-empty string.');
        }
        if (typeof toChain !== 'string' || toChain.trim() === '') {
            throw new Error('Invalid toChain: must be a non-empty string.');
        }
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount: must be a positive number.');
        }
        if (typeof asset !== 'string' || asset.trim() === '') {
            throw new Error('Invalid asset: must be a non-empty string.');
        }
    }
}

module.exports = new CrossChainUtils();
