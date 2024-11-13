class NFTService {
    constructor() {
        this.nfts = new Map(); // In-memory storage for NFTs
        this.currentId = 1; // Simple ID counter for NFTs
    }

    createNFT(name, description, owner) {
        const nftId = this.currentId++;
        const nft = {
            id: nftId,
            name,
            description,
            owner,
            createdAt: new Date(),
            status: 'available',
        };

        this.nfts.set(nftId, nft);
        return nft;
    }

    getNFT(nftId) {
        const nft = this.nfts.get(nftId);
        if (!nft) {
            throw new Error('NFT not found');
        }
        return nft;
    }

    transferNFT(nftId, newOwner) {
        const nft = this.nfts.get(nftId);
        if (!nft) {
            throw new Error('NFT not found');
        }
        nft.owner = newOwner;
        return nft;
    }

    listNFTs() {
        return Array.from(this.nfts.values());
    }
}

module.exports = new NFTService();
