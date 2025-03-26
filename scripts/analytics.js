// scripts/analytics.js
const { ethers } = require("hardhat");

async function run() {
    try {
        const Identity = await ethers.getContractFactory("Identity");
        const identity = await Identity.attach("YOUR_IDENTITY_CONTRACT_ADDRESS");

        // Fetch total registered users
        const userCount = await identity.getUserCount(); // Fixed typo in function name
        console.log("Total registered users:", userCount.toString());

        // Fetch additional analytics
        const activeUsers = await identity.getActiveUserCount(); // Assuming this function exists
        console.log("Total active users:", activeUsers.toString());

        const userDetails = await getUserDetails(identity, userCount);
        console.log("User details:", userDetails);

        // Additional analytics can be added here
    } catch (error) {
        console.error("Error fetching analytics:", error);
    }
}

// Function to fetch user details in parallel
async function getUserDetails(identity, userCount) {
    const userDetailsPromises = [];
    for (let i = 0; i < userCount; i++) {
        userDetailsPromises.push(identity.getUserDetails(i)); // Assuming this function exists
    }
    return await Promise.all(userDetailsPromises);
}

module.exports = { run };
