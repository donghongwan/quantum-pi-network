// tests/QuantumResistantMultiSigWallet.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuantumResistantMultiSigWallet", function () {
    let QuantumResistantMultiSigWallet;
    let wallet;
    let owner1, owner2, owner3, nonOwner;

    beforeEach(async function () {
        // Deploy the QuantumResistantMultiSigWallet contract before each test
        QuantumResistantMultiSigWallet = await ethers.getContractFactory("QuantumResistantMultiSigWallet");
        [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
        wallet = await QuantumResistantMultiSigWallet.deploy([owner1.address, owner2.address, owner3.address], 2);
        await wallet.deployed();
    });

    it("should allow owners to create a transaction", async function () {
        await wallet.createTransaction(owner2.address, ethers.utils.parseEther("1.0"));
        const transaction = await wallet.transactions(0);
        expect(transaction.to).to.equal(owner2.address);
        expect(transaction.value).to.equal(ethers.utils.parseEther("1.0"));
        expect(transaction.executed).to.be.false;
        expect(transaction.signatureCount).to.equal(0);
    });

    it("should allow owners to sign a transaction", async function () {
        await wallet.createTransaction(owner2.address, ethers.utils.parseEther("1.0"));
        await wallet.connect(owner1).signTransaction(0);
        const transaction = await wallet.transactions(0);
        expect(transaction.signatureCount).to.equal(1);
        expect(transaction.signatures[owner1.address]).to.be.true;
    });

    it("should execute a transaction when enough signatures are provided", async function () {
        await wallet.createTransaction(owner2.address, ethers.utils.parseEther("1.0"));
        await wallet.connect(owner1).signTransaction(0);
        await wallet.connect(owner2).signTransaction(0);

        // Fund the wallet with some ether
        await owner1.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther("2.0"),
        });

        await wallet.executeTransaction(0);
        const transaction = await wallet.transactions(0);
        expect(transaction.executed).to.be.true;
    });

    it("should not allow non-owners to create a transaction", async function () {
        await expect(wallet.connect(nonOwner).createTransaction(owner2.address, ethers.utils.parseEther("1.0")))
            .to.be.revertedWith("Not an owner");
    });

    it("should not allow signing an already executed transaction", async function () {
        await wallet.createTransaction(owner2.address, ethers.utils.parseEther("1.0"));
        await wallet.connect(owner1).signTransaction(0);
        await wallet.connect(owner2).signTransaction(0);
        await wallet.executeTransaction(0);

        await expect(wallet.connect(owner1).signTransaction(0))
            .to.be.revertedWith("Transaction already executed");
    });

    it("should allow adding a new owner", async function () {
        await wallet.addOwner(nonOwner.address);
        expect(await wallet.isOwner(nonOwner.address)).to.be.true;
    });

    it("should allow removing an existing owner", async function () {
        await wallet.removeOwner(owner3.address);
        expect(await wallet.isOwner(owner3.address)).to.be.false;
    });

    it("should not allow removing the last owner", async function () {
        await expect(wallet.removeOwner(owner1.address)).to.be.revertedWith("Cannot remove the last owner");
    });

    it("should expire a transaction after a certain period", async function () {
        await wallet.createTransaction(owner2.address, ethers.utils.parseEther("1.0"));
        await wallet.connect(owner1).signTransaction(0);
        
        // Fast forward time to simulate expiration
        await ethers.provider.send("evm_increaseTime", [86400 + 1]); // 1 day + 1 second
        await ethers.provider.send("evm_mine"); // Mine a new block

        await expect(wallet.executeTransaction(0)).to.be.revertedWith("Transaction has expired");
    });
});
