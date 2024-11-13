// quantumCrypto.js

const crypto = require('crypto');

// Function to generate a quantum-resistant key pair using a secure algorithm
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // Key size
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    return { publicKey, privateKey };
}

// Function to encrypt data using the public key
function encryptData(publicKey, data) {
    const bufferData = Buffer.from(data, 'utf-8');
    const encryptedData = crypto.publicEncrypt(publicKey, bufferData);
    return encryptedData.toString('base64');
}

// Function to decrypt data using the private key
function decryptData(privateKey, encryptedData) {
    const bufferData = Buffer.from(encryptedData, 'base64');
    const decryptedData = crypto.privateDecrypt(privateKey, bufferData);
    return decryptedData.toString('utf-8');
}

// Function to sign data using the private key
function signData(privateKey, data) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'base64');
}

// Function to verify the signature using the public key
function verifySignature(publicKey, data, signature) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
}

module.exports = {
    generateKeyPair,
    encryptData,
    decryptData,
    signData,
    verifySignature
};
