// stellarIntegration.js

const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon.stellar.org'); // Stellar test network
const keypair = StellarSdk.Keypair.fromSecret('YOUR_SECRET_KEY'); // Replace with your secret key

// Function to create a new Stellar account
async function createAccount() {
    const newKeypair = StellarSdk.Keypair.random();
    const response = await server.friendbot(newKeypair.publicKey()).call();
    return {
        publicKey: newKeypair.publicKey(),
        secretKey: newKeypair.secret(),
        response
    };
}

// Function to send Lumens (XLM) from one account to another
async function sendLumens(destination, amount) {
    const account = await server.loadAccount(keypair.publicKey());
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.PUBLIC
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
}

// Function to get account balance
async function getAccountBalance() {
    const account = await server.loadAccount(keypair.publicKey());
    return account.balances;
}

// Function to listen for incoming payments
async function listenForPayments() {
    server.payments()
        .forAccount(keypair.publicKey())
        .cursor('now')
        .stream({
            onmessage: (payment) => {
                console.log('Received payment:', payment);
            }
        });
}

module.exports = {
    createAccount,
    sendLumens,
    getAccountBalance,
    listenForPayments
};
