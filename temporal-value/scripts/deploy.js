// Import the necessary libraries
const hre = require("hardhat");

async function main() {
    // Get the contract factory for PiCoinTemporalValueAdjustment
    const PiCoinTemporalValueAdjustment = await hre.ethers.getContractFactory("PiCoinTemporalValueAdjustment");

    // Deploy the contract
    const piCoinTemporalValueAdjustment = await PiCoinTemporalValueAdjustment.deploy();

    // Wait for the deployment to be mined
    await piCoinTemporalValueAdjustment.deployed();

    // Log the address of the deployed contract
    console.log("PiCoinTemporalValueAdjustment deployed to:", piCoinTemporalValueAdjustment.address);
}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
