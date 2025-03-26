// scripts/seed.js
const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Seeding data with account: ${deployer.address}`);

    try {
        const piCoin = await getContractInstance('PiCoin', process.env.PICOIN_ADDRESS);
        const governance = await getContractInstance('Governance', process.env.GOVERNANCE_ADDRESS);

        // Mint tokens to the deployer
        await mintTokens(piCoin, deployer.address, '1000');

        // Create initial governance proposals
        await createGovernanceProposals(governance);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

// Function to get contract instance
async function getContractInstance(contractName, address) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    return await ContractFactory.attach(address);
}

// Function to mint tokens
async function mintTokens(piCoin, recipient, amount) {
    console.log('Minting tokens...');
    const mintTx = await piCoin.mint(recipient, ethers.utils.parseUnits(amount, 18));
    await mintTx.wait();
    console.log(`Minted ${amount} PiCoins to ${recipient}.`);
}

// Function to create governance proposals
async function createGovernanceProposals(governance) {
    const proposals = [
        { description: 'Increase block reward', amount: 100 },
        { description: 'Reduce transaction fees', amount: 50 },
    ];

    for (const proposal of proposals) {
        console.log(`Creating governance proposal: ${proposal.description}...`);
        const proposalTx = await governance.createProposal(proposal.description, proposal.amount);
        await proposalTx.wait();
        console.log(`Created proposal: ${proposal.description}`);
    }
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main execution:", error);
        process.exit(1);
    });
