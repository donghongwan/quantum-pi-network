// scripts/crossChain.js
const { ethers } = require("hardhat");

async function manage() {
    try {
        const CrossChain = await ethers.getContractFactory("CrossChain");
        const crossChain = await CrossChain.attach("YOUR_CROSS_CHAIN_CONTRACT_ADDRESS");

        // Example: Send a cross-chain message
        const message = "Hello from Chain A";
        const targetChainId = 1; // Example chain ID

        // Send the message and wait for confirmation
        const tx = await sendCrossChainMessage(crossChain, message, targetChainId);
        console.log("Sent cross-chain message:", message, "to chain ID:", targetChainId);

        // Listen for confirmation event
        await listenForConfirmation(crossChain, tx.hash);
    } catch (error) {
        console.error("Error managing cross-chain communication:", error);
    }
}

// Function to send a cross-chain message
async function sendCrossChainMessage(crossChain, message, targetChainId) {
    const tx = await crossChain.sendMessage(message, targetChainId);
    await tx.wait(); // Wait for the transaction to be mined
    return tx;
}

// Function to listen for confirmation events
async function listenForConfirmation(crossChain, txHash) {
    const receipt = await crossChain.provider.getTransactionReceipt(txHash);
    if (receipt && receipt.status === 1) {
        console.log("Transaction confirmed:", txHash);
    } else {
        console.error("Transaction failed or not confirmed:", txHash);
    }
}

// Function to send different types of messages
async function sendMessage(crossChain, message, targetChainId, messageType = "text") {
    if (messageType === "text") {
        return await sendCrossChainMessage(crossChain, message, targetChainId);
    } else if (messageType === "data") {
        // Handle data messages (e.g., binary data)
        const data = ethers.utils.toUtf8Bytes(message);
        return await crossChain.sendData(data, targetChainId);
    } else {
        throw new Error("Unsupported message type");
    }
}

module.exports = { manage };
