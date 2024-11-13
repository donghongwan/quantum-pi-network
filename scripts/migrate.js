// scripts/migrate.js

const { ethers, upgrades } = require('hardhat');

async function main() {
    const Governance = await ethers.getContractFactory('Governance');
    const governance = await upgrades.upgradeProxy(process.env.GOVERNANCE_ADDRESS, Governance);
    await governance.deployed();
    console.log(`Governance upgraded to: ${governance.address}`);

    const PiCoin = await ethers.getContractFactory('PiCoin');
    const piCoin = await upgrades.upgradeProxy(process.env.PICOIN_ADDRESS, PiCoin);
    await piCoin.deployed();
    console.log(`PiCoin upgraded to: ${piCoin.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
