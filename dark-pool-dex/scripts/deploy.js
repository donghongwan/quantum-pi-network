// Import the necessary libraries
const hre = require("hardhat");

async function main() {
    // Get the contract factory for DarkPoolDEX
    const DarkPoolDEX = await hre.ethers.getContractFactory("DarkPoolDEX");

    // Deploy the contract
    const darkPoolDEX = await DarkPoolDEX.deploy();

    // Wait for the deployment to be mined
    await darkPoolDEX.deployed();

    // Log the address of the deployed contract
    console.log("DarkPoolDEX deployed to:", darkPoolDEX.address);
}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
