// scripts/seed.js

const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Seeding data with account: ${deployer.address}`);

    const PiCoin = await ethers.getContractFactory('PiCoin');
    const piCoin = await PiCoin.attach(process.env.PICOIN_ADDRESS); // Replace with your deployed contract address

    const Governance = await ethers.getContractFactory('Governance');
    const governance = await Governance.attach(process.env.GOVERNANCE_ADDRESS); // Replace with your deployed contract address

    // Mint tokens to the deployer
    console.log('Minting tokens...');
    const mintTx = await piCoin.mint(deployer.address, ethers.utils.parseUnits('1000', 18));
    await mintTx.wait();
    console.log('Minted 1000 PiCoins to deployer.');

    // Create initial governance proposals
    console.log('Creating governance proposals...');
    const proposalTx1 = await governance.createProposal('Increase block reward', 100);
    await proposalTx1.wait();
    console.log('Created proposal: Increase block reward');

    const proposalTx2 = await governance.createProposal('Reduce transaction fees', 50);
    await proposalTx2.wait();
    console.log('Created proposal: Reduce transaction fees');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
