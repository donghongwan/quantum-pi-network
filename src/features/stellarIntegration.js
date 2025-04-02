// stellarIntegration.js

const StellarSdk = require('stellar-sdk');
const winston = require('winston'); // For logging
require('dotenv').config(); // For environment variable management

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'stellarIntegration.log' })
    ]
});

// Stellar network configuration
const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'test'; // 'test' or 'public'
const HORIZON_URL = STELLAR_NETWORK === 'public' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Server(HORIZON_URL);
const keypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_SECRET_KEY); // Replace with your secret key

/**
 * Create a new Stellar account.
 * @returns {Promise<Object>} - The new account's public and secret keys along with the response from the friendbot.
 */
async function createAccount() {
    try {
        const newKeypair = StellarSdk.Keypair.random();
        const response = await server.friendbot(newKeypair.publicKey()).call();
        logger.info(`New account created: ${newKeypair.publicKey()}`);
        return {
            publicKey: newKeypair.publicKey(),
            secretKey: newKeypair.secret(),
            response
        };
    } catch (error) {
        logger.error(`Error creating account: ${error.message}`);
        throw error;
    }
}

/**
 * Send Lumens (XLM) from one account to another.
 * @param {string} destination - The destination account's public key.
 * @param {number} amount - The amount of Lumens to send.
 * @returns {Promise<void>}
 */
async function sendLumens(destination, amount) {
    try {
        const account = await server.loadAccount(keypair.publicKey());
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks[STELLAR_NETWORK.toUpperCase()]
        })
            .addOperation(StellarSdk.Operation.payment({
                destination,
                asset: StellarSdk.Asset.native(),
                amount: amount.toString()
            }))
            .setTimeout(30)
            .build();

        transaction.sign(keypair);
        await server.submitTransaction(transaction);
        logger.info(`Sent ${amount} XLM to ${destination}`);
    } catch (error) {
        logger.error(`Error sending Lumens: ${error.message}`);
        throw error;
    }
}

/**
 * Get account balance.
 * @returns {Promise<Array>} - The account's balances.
 */
async function getAccountBalance() {
    try {
        const account = await server.loadAccount(keypair.publicKey());
        logger.info(`Fetched balance for account: ${keypair.publicKey()}`);
        return account.balances;
    } catch (error) {
        logger.error(`Error fetching account balance: ${error.message}`);
        throw error;
    }
}

/**
 * Listen for incoming payments.
 */
async function listenForPayments() {
    try {
        server.payments()
            .forAccount(keypair.publicKey())
            .cursor('now')
            .stream({
                onmessage: (payment) => {
                    logger.info('Received payment:', payment);
                    console.log('Received payment:', payment);
                }
            });
    } catch (error) {
        logger.error(`Error listening for payments: ${error.message}`);
        throw error;
    }
}

module.exports = {
    createAccount,
    sendLumens,
    getAccountBalance,
    listenForPayments
};
