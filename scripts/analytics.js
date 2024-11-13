// scripts/analytics.js
const { ethers } = require("hardhat");

async function run() {
    const Identity = await ethers.getContractFactory("Identity");
    const identity = await Identity.attach("YOUR_IDENTITY_CONTRACT_ADDRESS");

    const userCount = await identity.getUser Count(); // Assuming you have a function to get user count
    console.log("Total registered users:", userCount);

    // Add more analytics as needed
}

module.exports = { run };
