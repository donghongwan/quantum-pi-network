// scripts/crossChain.js
const { ethers } = require("hardhat");

async function manage() {
    const CrossChain = await ethers.getContractFactory("CrossChain");
    const crossChain = await CrossChain.attach("YOUR_CROSS_CHAIN_CONTRACT_ADDRESS");

    // Example: Send a cross-chain message
    const message = "Hello from Chain A";
    const targetChainId = 1; // Example chain ID
    const tx = await crossChain.sendMessage(message, targetChainId);
    await tx.wait();
    console.log("Sent cross-chain message:", message, "to chain ID:", targetChainId);
}

module.exports = { manage };
