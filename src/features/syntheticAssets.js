// syntheticAssets.js

const syntheticAssets = {};

class SyntheticAsset {
    constructor(name, underlyingAsset, price) {
        this.name = name;
        this.underlyingAsset = underlyingAsset;
        this.price = price;
        this.totalSupply = 0;
    }

    mint(amount) {
        this.totalSupply += amount;
        console.log(`Minted ${amount} of ${this.name}. Total supply: ${this.totalSupply}`);
    }

    burn(amount) {
        if (amount > this.totalSupply) {
            throw new Error('Insufficient supply to burn');
        }
        this.totalSupply -= amount;
        console.log(`Burned ${amount} of ${this.name}. Total supply: ${this.totalSupply}`);
    }

    updatePrice(newPrice) {
        this.price = newPrice;
        console.log(`Updated price of ${this.name} to ${this.price}`);
    }
}

// Function to create a new synthetic asset
function createSyntheticAsset(name, underlyingAsset, price) {
    const asset = new SyntheticAsset(name, underlyingAsset, price);
    syntheticAssets[name] = asset;
    return asset;
}

// Function to get a synthetic asset by name
function getSyntheticAsset(name) {
    return syntheticAssets[name];
}

module.exports = {
    createSyntheticAsset,
    getSyntheticAsset
};
