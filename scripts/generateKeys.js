// scripts/generateKeys.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to generate a pair of keys
function generateKeyPair(keyType = 'rsa', modulusLength = 2048) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync(keyType, {
        modulusLength: modulusLength, // Key size
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
function saveKeysToFile(publicKey, privateKey, outputDir = './keys') {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const publicKeyPath = path.join(outputDir, 'publicKey.pem');
    const privateKeyPath = path.join(outputDir, 'privateKey.pem');

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log(`Keys have been generated and saved to ${publicKeyPath} and ${privateKeyPath}`);
}

// Main function to generate and save keys
function main() {
    const keyType = process.argv[2] || 'rsa'; // Accept key type as command line argument
    const modulusLength = parseInt(process.argv[3], 10) || 2048; // Accept modulus length as command line argument

    try {
        const { publicKey, privateKey } = generateKeyPair(keyType, modulusLength);
        saveKeysToFile(publicKey, privateKey);
    } catch (error) {
        console.error("Error generating keys:", error);
    }
}

// Execute the main function
main();
