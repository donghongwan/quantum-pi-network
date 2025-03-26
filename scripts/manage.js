// scripts/manage.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Managing application with account:", deployer.address);

    try {
        // Run all management tasks concurrently
        await Promise.all([
            runAnalytics(),
            manageNFTs(),
            manageCrossChain()
        ]);
    } catch (error) {
        console.error("Error during management tasks:", error);
    }
}

async function runAnalytics() {
    try {
        const analytics = require("./analytics");
        await analytics.run();
        console.log("Analytics run completed successfully.");
    } catch (error) {
        console.error("Error running analytics:", error);
    }
}

async function manageNFTs() {
    try {
        const nftManager = require("./nft");
        await nftManager.manage();
        console.log("NFT management completed successfully.");
    } catch (error) {
        console.error("Error managing NFTs:", error);
    }
}

async function manageCrossChain() {
    try {
        const crossChainManager = require("./crossChain");
        await crossChainManager.manage();
        console.log("Cross-chain management completed successfully.");
    } catch (error) {
        console.error("Error managing cross-chain:", error);
    }
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main execution:", error);
        process.exit(1);
    });
