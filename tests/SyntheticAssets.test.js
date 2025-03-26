// tests/SyntheticAssets.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SyntheticAssets Contract", function () {
    let SyntheticAssets;
    let syntheticAssets;
    let owner;
    let addr1;
    let addr2;
    let mockToken;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        SyntheticAssets = await ethers.getContractFactory("SyntheticAssets");
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy a mock ERC20 token
        const MockToken = await ethers.getContractFactory("ERC20");
        mockToken = await MockToken.deploy("Mock Token", "MTK", 1000000);
        await mockToken.deployed();

        // Deploy the SyntheticAssets contract
        syntheticAssets = await SyntheticAssets.deploy();
        await syntheticAssets.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await syntheticAssets.owner()).to.equal(owner.address);
        });
    });

    describe("Creating Synthetic Assets", function () {
        it("Should create a synthetic asset", async function () {
            await syntheticAssets.createSyntheticAsset("Gold", mockToken.address, 150, "0x0000000000000000000000000000000000000000");
            expect(await syntheticAssets.underlyingAssets("Gold")).to.equal(mockToken.address);
        });

        it("Should fail if asset already exists", async function () {
            await syntheticAssets.createSyntheticAsset("Gold", mockToken.address, 150, "0x0000000000000000000000000000000000000000");
            await expect(syntheticAssets.createSyntheticAsset("Gold", mockToken.address, 150, "0x0000000000000000000000000000000000000000"))
                .to.be.revertedWith("Asset already exists");
        });

        it("Should fail if collateralization is less than or equal to 100", async function () {
            await expect(syntheticAssets.createSyntheticAsset("Silver", mockToken.address, 100, "0x0000000000000000000000000000000000000000"))
                .to.be.revertedWith("Collateralization must be greater than 100%");
        });
    });

    describe("Minting Synthetic Assets", function () {
        beforeEach(async function () {
            await syntheticAssets.createSyntheticAsset("Gold", mockToken.address, 150, "0x0000000000000000000000000000000000000000");
            await mockToken.approve(syntheticAssets.address, 1000);
        });

        it("Should mint synthetic assets", async function () {
            await syntheticAssets.connect(addr1).mintSyntheticAsset("Gold", 10);
            expect(await syntheticAssets.balanceOf(addr1.address)).to.equal(10);
        });

        it("Should fail if not enough collateral", async function () {
            await expect(syntheticAssets.connect(addr1).mintSyntheticAsset("Gold", 10))
                .to.be.revertedWith("ERC20: transfer amount exceeds allowance");
        });
    });

    describe("Burning Synthetic Assets", function () {
        beforeEach(async function () {
            await syntheticAssets.createSyntheticAsset("Gold", mockToken.address, 150, "0x0000000000000000000000000000000000000000");
            await mockToken.approve(syntheticAssets.address, 1000);
            await syntheticAssets.connect(addr1).mintSyntheticAsset("Gold", 10);
        });

        it("Should burn synthetic assets", async function () {
            await syntheticAssets.connect(addr1).burnSyntheticAsset("Gold", 10);
            expect(await syntheticAssets.balanceOf(addr1.address)).to.equal(0);
        });

        it("Should return collateral after burning", async function () {
            const initialBalance = await mockToken.balanceOf(addr1.address);
            await syntheticAssets.connect(addr1).burnSyntheticAsset("Gold", 10);
            const finalBalance = await mockToken.balanceOf(addr1.address);
            expect(finalBalance).to.be.greaterThan(initialBalance);
        });
    });

    describe("Updating Collateralization Ratio", function () {
        beforeEach(async function () {
            await syntheticAssets.createSyntheticAsset("Gold", mockToken.address, 150, "0x0000000000000000000000000000000000000000");
        });

        it("Should update collateralization ratio", async function () {
            await syntheticAssets.updateCollateralizationRatio("Gold ", 200);
            const newRatio = await syntheticAssets.collateralizationRatios("Gold");
            expect(newRatio).to.equal(200);
        });

        it("Should fail if new ratio is less than or equal to 100", ", 200);
            const newRatio = await syntheticAssets.collateralizationRatios("Gold");
            expect(newRatio).to.equal(200);
        });

        it("Should fail if new ratio is less than or equal to 100", async function () {
            await expect(syntheticAssets.updateCollateralizationRatio("Gold", 100))
                .to.be.revertedWith("Collateralization must be greater than 100%");
        });
    });
}); async function () {
            await expect(syntheticAssets.updateCollateralizationRatio("Gold", 100))
                .to.be.revertedWith("Collateralization must be greater than 100%");
        });
    });
});
