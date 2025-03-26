// scripts/deploy.js
const { ethers, upgrades, run } = require('hardhat');

async function main() {
    try {
        // Load environment variables
        const { PI_COIN_NAME, PI_COIN_SYMBOL, GOVERNANCE_NAME } = process.env;

        // Get the contract factories
        const PiCoin = await ethers.getContractFactory('PiCoin');
        const Governance = await ethers.getContractFactory('Governance');

        // Deploy the PiCoin contract
        console.log('Deploying PiCoin...');
        const piCoin = await upgrades.deployProxy(PiCoin, [PI_COIN_NAME || 'PiCoin', PI_COIN_SYMBOL || 'PI'], { initializer: 'initialize' });
        await piCoin.deployed();
        console.log(`PiCoin deployed to: ${piCoin.address}`);

        // Deploy the Governance contract
        console.log('Deploying Governance...');
        const governance = await upgrades.deployProxy(Governance, [piCoin.address], { initializer: 'initialize' });
        await governance.deployed();
        console.log(`Governance deployed to: ${governance.address}`);

        // Verify contracts on Etherscan (optional)
        await verifyContract(piCoin.address, [PI_COIN_NAME || 'PiCoin', PI_COIN_SYMBOL || 'PI']);
        await verifyContract(governance.address, [piCoin.address]);
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

// Function to verify contracts on Etherscan
async function verifyContract(address, args) {
    console.log(`Verifying contract at ${address}...`);
    try {
        await run("verify:verify", {
            address: address,
            constructorArguments: args,
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
