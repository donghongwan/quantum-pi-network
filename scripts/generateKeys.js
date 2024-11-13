// scripts/generateKeys.js

const crypto = require('crypto');
const fs = require('fs');

// Function to generate a pair of keys
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // Key size
        publicKeyEncoding: {
            type: 'spki', // Recommended for public keys
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8', // Recommended for private keys
            format: 'pem'
        }
    });

    return { publicKey, privateKey };
}

// Function to save keys to files
function saveKeysToFile(publicKey, privateKey) {
    fs.writeFileSync('publicKey.pem', publicKey);
    fs.writeFileSync('privateKey.pem', privateKey);
    console.log('Keys have been generated and saved to publicKey.pem and privateKey.pem');
}

// Main function to generate and save keys
function main() {
    const { publicKey, privateKey } = generateKeyPair();
    saveKeysToFile(publicKey, privateKey);
}

// Execute the main function
main();
