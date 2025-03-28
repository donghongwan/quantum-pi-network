// tests/cross_chain/CrossChain.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChain Contract", function () {
    let CrossChain;
    let crossChain;
    let user1;

    beforeEach(async function () {
        CrossChain = await ethers.getContractFactory("CrossChain");
        crossChain = await CrossChain.deploy();
        [user1] = await ethers.getSigners();
    });

    it("should send a message", async function () {
        const message = "Hello from Chain A";
        const targetChainId = 1; // Example chain ID
        await expect(crossChain.sendMessage(message, targetChainId))
            .to.emit(crossChain, "CrossChainMessage")
            .withArgs(user1.address, message, targetChainId, 1); // Message ID starts from 1
    });

    it("should retrieve a message", async function () {
        const message = "Hello from Chain A";
        const targetChainId = 1;
        await crossChain.sendMessage(message, targetChainId);
        const msgData = await crossChain.getMessage(1);
        expect(msgData[0]).to.equal(user1.address);
        expect(msgData[1]).to.equal(message);
        expect(msgData[2]).to.equal(targetChainId);
    });

    it("should revert when retrieving a non-existent message", async function () {
        await expect(crossChain.getMessage(999))
            .to.be.revertedWith("Message does not exist");
    });
});
