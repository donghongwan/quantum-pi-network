// scripts/nft.js
const { ethers } = require("hardhat");

async function manage() {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.attach("YOUR_NFT_CONTRACT_ADDRESS");

    // Example: Mint a new NFT
    const tokenURI = "https://example.com/token/1";
    const royalty = 500; // 5%
    const tx = await nft.mint(tokenURI, royalty);
    await tx.wait();
    console.log("Minted NFT with token URI:", tokenURI);

    // Example: Update royalty for an NFT
    const tokenId = 0; // Assuming this token exists
    const newRoyalty = 800; // Update to 8%
    const updateTx = await nft.updateRoyalty(tokenId, newRoyalty);
    await updateTx.wait();
    console.log("Updated royalty for token ID:", tokenId, "to", newRoyalty);
}

module.exports = { manage };
