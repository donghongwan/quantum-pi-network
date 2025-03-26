// scripts/nft.js
const { ethers } = require("hardhat");

async function manage() {
    try {
        const NFT = await ethers.getContractFactory("NFT");
        const nft = await NFT.attach(process.env.NFT_CONTRACT_ADDRESS); // Use environment variable for contract address

        // Example: Mint a new NFT
        const tokenURI = generateTokenURI(1); // Generate token URI dynamically
        const royalty = 500; // 5%
        await mintNFT(nft, tokenURI, royalty);

        // Example: Update royalty for an NFT
        const tokenId = 0; // Assuming this token exists
        const newRoyalty = 800; // Update to 8%
        await updateRoyalty(nft, tokenId, newRoyalty);
    } catch (error) {
        console.error("Error managing NFTs:", error);
    }
}

// Function to mint a new NFT
async function mintNFT(nft, tokenURI, royalty) {
    try {
        const tx = await nft.mint(tokenURI, royalty);
        await tx.wait();
        console.log("Minted NFT with token URI:", tokenURI);
    } catch (error) {
        console.error("Error minting NFT:", error);
    }
}

// Function to update royalty for an NFT
async function updateRoyalty(nft, tokenId, newRoyalty) {
    try {
        const updateTx = await nft.updateRoyalty(tokenId, newRoyalty);
        await updateTx.wait();
        console.log("Updated royalty for token ID:", tokenId, "to", newRoyalty);
    } catch (error) {
        console.error("Error updating royalty for token ID:", tokenId, error);
    }
}

// Function to generate a token URI dynamically
function generateTokenURI(tokenId) {
    return `https://example.com/token/${tokenId}`;
}

// Execute the manage function
manage()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main execution:", error);
        process.exit(1);
    });
