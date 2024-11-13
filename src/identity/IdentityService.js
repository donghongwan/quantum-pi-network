const { generateKeyPair, sign, verify } = require('crypto');
const { createHash } = require('crypto');
const identityUtils = require('./identityUtils');

class IdentityService {
    constructor() {
        this.identities = new Map(); // In-memory storage for identities
    }

    async createIdentity(username, email) {
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
        return identity;
    }

    async verifyIdentity(identityId, signature) {
        const identity = this.identities.get(identityId);
        if (!identity) {
            throw new Error('Identity not found');
        }

        const isVerified = verify(
            'SHA256',
            Buffer.from(identityId),
            {
                key: identity.publicKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            Buffer.from(signature)
        );

        return isVerified;
    }

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
                    return reject(err);
                }
                resolve({ publicKey, privateKey });
            });
        });
    }
}

module.exports = new IdentityService();
