// scripts/manage.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Managing application with account:", deployer.address);

    // You can call other scripts or functions here
    // For example, you can run analytics or manage NFTs
    await runAnalytics();
    await manageNFTs();
    await manageCrossChain();
}

async function runAnalytics() {
    const analytics = require("./analytics");
    await analytics.run();
}

async function manageNFTs() {
    const nftManager = require("./nft");
    await nftManager.manage();
}

async function manageCrossChain() {
    const crossChainManager = require("./crossChain");
    await crossChainManager.manage();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
