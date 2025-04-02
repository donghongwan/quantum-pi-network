// src/utils/IdentityUtils.js

const { createHash } = require('crypto');
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
        new winston.transports.File({ filename: 'identityUtils.log' })
    ]
});

class IdentityUtils {
    /**
     * Generate a unique identity ID based on username, email, and current timestamp.
     * @param {string} username - The username for the identity.
     * @param {string} email - The email for the identity.
     * @returns {string} - The generated identity ID.
     */
    generateIdentityId(username, email) {
        if (!username || !email) {
            logger.error('Username and email are required to generate an identity ID');
            throw new Error('Username and email are required');
        }

        const hash = createHash('sha256');
        hash.update(`${username}:${email}:${Date.now()}`);
        const identityId = hash.digest('hex');
        logger.info(`Generated identity ID: ${identityId} for username: ${username} and email: ${email}`);
        return identityId;
    }

    /**
     * Validate an email address format.
     * @param {string} email - The email address to validate.
     * @returns {boolean} - True if valid, otherwise false.
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        if (!isValid) {
            logger.error(`Invalid email format: ${email}`);
        }
        return isValid;
    }

    /**
     * Validate a username.
     * @param {string} username - The username to validate.
     * @returns {boolean} - True if valid, otherwise false.
     */
    validateUsername(username) {
        const isValid = typeof username === 'string' && username.trim() !== '';
        if (!isValid) {
            logger.error(`Invalid username: ${username}`);
        }
        return isValid;
    }

    // Additional utility functions can be added here
}

module.exports = new IdentityUtils();
