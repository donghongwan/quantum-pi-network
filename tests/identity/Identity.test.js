const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Identity Contract", function () {
    let Identity;
    let identity;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        Identity = await ethers.getContractFactory("Identity");
        identity = await Identity.deploy();
        [owner, user1, user2] = await ethers.getSigners();
    });

    it("should register a user", async function () {
        await identity.connect(user1).registerUser ("Alice", "alice@example.com");
        const userInfo = await identity.getUser (user1.address);
        expect(userInfo[0]).to.equal("Alice");
        expect(userInfo[1]).to.equal("alice@example.com");
        expect(userInfo[2]).to.equal(false); // Not verified yet
    });

    it("should not allow duplicate registration", async function () {
        await identity.connect(user1).registerUser ("Alice", "alice@example.com");
        await expect(identity.connect(user1).registerUser ("Alice", "alice@example.com"))
            .to.be.revertedWith("User   already registered");
    });

    it("should allow admin to verify a user", async function () {
        await identity.connect(user1).registerUser ("Alice", "alice@example.com");
        await identity.verifyUser (user1.address);
        const userInfo = await identity.getUser (user1.address);
        expect(userInfo[2]).to.equal(true); // Now verified
    });

    it("should not allow non-admin to verify a user", async function () {
        await identity.connect(user1).registerUser ("Alice", "alice@example.com");
        await expect(identity.connect(user2).verifyUser (user1.address))
            .to.be.revertedWith("Caller is not an admin");
    });
});
