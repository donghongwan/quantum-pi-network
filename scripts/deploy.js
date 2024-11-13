// scripts/deploy.js

const { ethers, upgrades } = require('hardhat');

async function main() {
    // Get the contract factory
    const PiCoin = await ethers.getContractFactory('PiCoin');
    const Governance = await ethers.getContractFactory('Governance');

    // Deploy the contracts
    console.log('Deploying PiCoin...');
    const piCoin = await upgrades.deployProxy(PiCoin, ['PiCoin', 'PI']);
    await piCoin.deployed();
    console.log(`PiCoin deployed to: ${piCoin.address}`);

    console.log('Deploying Governance...');
    const governance = await upgrades.deployProxy(Governance, [piCoin.address]);
    await governance.deployed();
    console.log(`Governance deployed to: ${governance.address}`);

    // Verify contracts on Etherscan (optional)
    // await verifyContract(piCoin.address, []);
    // await verifyContract(governance.address, [piCoin.address]);
}

// Uncomment this function if you want to verify contracts on Etherscan
/*
async function verifyContract(address, args) {
    console.log(`Verifying contract at ${address}...`);
    await run("verify:verify", {
        address: address,
        constructorArguments: args,
    });
}
*/

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
