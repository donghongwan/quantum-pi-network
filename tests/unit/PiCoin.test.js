// unit/PiCoin.test.js

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PiCoin Contract', function () {
    let PiCoin;
    let piCoin;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        PiCoin = await ethers.getContractFactory('PiCoin');
        [owner, addr1, addr2] = await ethers.getSigners();
        piCoin = await PiCoin.deploy();
        await piCoin.deployed();
    });

    it('Should mint tokens to the owner', async function () {
        const ownerBalance = await piCoin.balanceOf(owner.address);
        expect(await piCoin.totalSupply()).to.equal(ownerBalance);
    });

    it('Should transfer tokens between accounts', async function () {
        await piCoin.transfer(addr1.address, 50);
        const addr1Balance = await piCoin.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(50);
    });

    it('Should fail if sender does not have enough tokens', async function () {
        const initialOwnerBalance = await piCoin.balanceOf(owner.address);
        await expect(piCoin.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith('Not enough tokens');
        expect(await piCoin.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    // Additional tests can be added here
});
