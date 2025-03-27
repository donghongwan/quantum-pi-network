// ComputeMarketplace.js
const StellarSdk = require('stellar-sdk');
const { Server, TransactionBuilder, Operation, Asset } = StellarSdk;

class ComputeMarketplace {
    constructor(stellarServerUrl, piCoinAsset) {
        this.server = new Server(stellarServerUrl);
        this.piCoinAsset = piCoinAsset; // The Pi Coin asset on Stellar
        this.services = new Map(); // In-memory storage for services
        this.serviceCount = 0; // Counter for service IDs
    }

    async listService(providerKeypair, description, price) {
        if (price <= 0) {
            throw new Error('Price must be greater than zero');
        }

        this.serviceCount++;
        const serviceId = this.serviceCount;
        this.services.set(serviceId, {
            provider: providerKeypair.publicKey(),
            description,
            price,
            isActive: true,
        });

        console.log(`Service listed: ID ${serviceId}, Provider: ${providerKeypair.publicKey()}, Description: ${description}, Price: ${price}`);
        return serviceId;
    }

    async purchaseService(buyerKeypair, serviceId) {
        const service = this.services.get(serviceId);
        if (!service || !service.isActive) {
            throw new Error('Service is not active or does not exist');
        }

        const transaction = new TransactionBuilder(await this.server.loadAccount(buyerKeypair.publicKey()), {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.PUBLIC,
        })
            .addOperation(Operation.payment({
                destination: service.provider,
                asset: this.piCoinAsset,
                amount: service.price.toString(),
            }))
            .setTimeout(30)
            .build();

        transaction.sign(buyerKeypair);
        await this.server.submitTransaction(transaction);
        console.log(`Service purchased: ID ${serviceId}, Buyer: ${buyerKeypair.publicKey()}`);
    }

    deactivateService(providerKeypair, serviceId) {
        const service = this.services.get(serviceId);
        if (!service || service.provider !== providerKeypair.publicKey()) {
            throw new Error('Only the provider can deactivate the service');
        }
        service.isActive = false;
        console.log(`Service deactivated: ID ${serviceId}`);
    }
}

module.exports = ComputeMarketplace;
