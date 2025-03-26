// scripts/migrate.js
const { ethers, upgrades, run } = require('hardhat');

async function main() {
    try {
        // Upgrade Governance contract
        await upgradeContract('Governance', process.env.GOVERNANCE_ADDRESS);
        
        // Upgrade PiCoin contract
        await upgradeContract('PiCoin', process.env.PICOIN_ADDRESS);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

// Function to upgrade a contract
async function upgradeContract(contractName, contractAddress) {
    console.log(`Upgrading ${contractName} at address: ${contractAddress}...`);
    
    const ContractFactory = await ethers.getContractFactory(contractName);
    const upgradedContract = await upgrades.upgradeProxy(contractAddress, ContractFactory);
    await upgradedContract.deployed();
    
    console.log(`${contractName} upgraded to: ${upgradedContract.address}`);
    
    // Optional: Verify the upgraded contract on Etherscan
    await verifyContract(upgradedContract.address);
}

// Function to verify contracts on Etherscan
async function verifyContract(address) {
    console.log(`Verifying contract at ${address}...`);
    try {
        await run("verify:verify", {
            address: address,
            constructorArguments: [], // Add constructor arguments if needed
        });
        console.log(`Contract verified at ${address}`);
    } catch (error) {
        console.error(`Verification failed for ${address}:`, error);
    }
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main execution:", error);
        process.exit(1);
    });
