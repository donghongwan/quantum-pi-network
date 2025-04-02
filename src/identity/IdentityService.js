// src/services/IdentityService.js

const { generateKeyPair, verify } = require('crypto');
const identityUtils = require('./identityUtils');
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
        new winston.transports.File({ filename: 'identityService.log' })
    ]
});

class IdentityService {
    constructor() {
        this.identities = new Map(); // In-memory storage for identities
    }

    /**
     * Create a new identity with a key pair.
     * @param {string} username - The username for the identity.
     * @param {string} email - The email for the identity.
     * @returns {Promise<Object>} - The created identity.
     */
    async createIdentity(username, email) {
        if (!username || !email) {
            logger.error('Username and email are required to create an identity');
            throw new Error('Username and email are required');
        }

        const { publicKey, privateKey } = await this.generateKeyPair();
        const identityId = identityUtils.generateIdentityId(username, email);
        const identity = {
            id: identityId,
            username,
            email,
            publicKey,
            privateKey,
            createdAt: new Date(),
        };

        this.identities.set(identityId, identity);
        logger.info(`Identity created: ${JSON.stringify(identity)}`);
        return identity;
    }

    /**
     * Verify an identity using its ID and signature.
     * @param {string} identityId - The ID of the identity to verify.
     * @param {string} signature - The signature to verify against.
     * @returns {Promise<boolean>} - True if verified, otherwise false.
     */
    async verifyIdentity(identityId, signature) {
        const identity = this.identities.get(identityId);
        if (!identity) {
            logger.error(`Identity not found: ID ${identityId}`);
            throw new Error('Identity not found');
        }

        const isVerified = verify(
            'SHA256',
            Buffer.from(identityId),
            {
                key: identity.publicKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            Buffer.from(signature, 'base64') // Assuming signature is base64 encoded
        );

        logger.info(`Identity verification result for ID ${identityId}: ${isVerified}`);
        return isVerified;
    }

    /**
     * Generate a new RSA key pair.
     * @returns {Promise<Object>} - The generated public and private keys.
     */
    async generateKeyPair() {
        return new Promise((resolve, reject) => {
            generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            }, (err, publicKey, privateKey) => {
                if (err) {
                    logger.error('Error generating key pair:', err.message);
                    return reject(err);
                }
                resolve({ publicKey, privateKey });
            });
        });
    }
}

module.exports = new IdentityService();
