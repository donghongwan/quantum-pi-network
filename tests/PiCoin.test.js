// tests/PiCoin.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PiCoin", function () {
    let PiCoin;
    let piCoin;
    let owner;
    let minter;
    let burner;

    beforeEach(async function () {
        // Deploy the PiCoin contract before each test
        PiCoin = await ethers.getContractFactory("PiCoin");
        [owner, minter, burner] = await ethers.getSigners();
        piCoin = await PiCoin.deploy();
        await piCoin.deployed();
    });

    it("should have the correct name and symbol", async function () {
        expect(await piCoin.name()).to.equal("PiCoin");
        expect(await piCoin.symbol()).to.equal("PI");
    });

    it("should mint new tokens", async function () {
        await piCoin.assignMinter(minter.address);
        await piCoin.connect(minter).mint(owner.address, 1000);
        expect(await piCoin.balanceOf(owner.address)).to.equal(1000);
    });

    it("should burn tokens", async function () {
        await piCoin.assignMinter(minter.address);
        await piCoin.connect(minter).mint(owner.address, 1000);
        await piCoin.assignBurner(burner.address);
        await piCoin.connect(burner).burn(500);
        expect(await piCoin.balanceOf(owner.address)).to.equal(500);
    });

    it("should not allow burning more than balance", async function () {
        await piCoin.assignMinter(minter.address);
        await piCoin.connect(minter).mint(owner.address, 1000);
        await piCoin.assignBurner(burner.address);
        await expect(piCoin.connect(burner).burn(1500)).to.be.revertedWith("Insufficient balance to burn");
    });

    it("should pause and unpause the contract", async function () {
        await piCoin.pause();
        await expect(piCoin.connect(minter).mint(owner.address, 1000)).to.be.revertedWith("Pausable: paused");
        await piCoin.unpause();
        await piCoin.connect(minter).mint(owner.address, 1000);
        expect(await piCoin.balanceOf(owner.address)).to.equal(1000);
    });

    it("should not allow minting to the zero address", async function () {
        await piCoin.assignMinter(minter.address);
        await expect(piCoin.connect(minter).mint(ethers.constants.AddressZero, 1000)).to.be.revertedWith("Cannot mint to the zero address");
    });

    it("should not allow non-minters to mint", async function () {
        await expect(piCoin.connect(minter).mint(owner.address, 1000)).to.be.revertedWith("Caller is not a minter");
    });

    it("should not allow non-burners to burn", async function () {
        await piCoin.assignMinter(minter.address);
        await piCoin.connect(minter).mint(owner.address, 1000);
        await expect(piCoin.connect(owner).burn(500)).to.be.revertedWith("Caller is not a burner");
    });
});
