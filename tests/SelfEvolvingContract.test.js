const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SelfEvolvingContract", function () {
    let contract;
    let owner;
    let addr1;
    let addr2;
    const requiredVotes = 2;
    const proposalDuration = 60; // 60 seconds for testing

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const SelfEvolvingContract = await ethers.getContractFactory("SelfEvolvingContract");
        contract = await SelfEvolvingContract.deploy(requiredVotes, proposalDuration);
        await contract.deployed();
    });

    it("Should set the correct owner and initial version", async function () {
        expect(await contract.owner()).to.equal(owner.address);
        expect(await contract.currentVersion()).to.equal("1.0");
    });

    it("Should allow the owner to propose an update", async function () {
        await contract.proposeUpdate("1.1");
        const proposals = await contract.getProposals();
        expect(proposals).to.include("1.1");
    });

    it("Should not allow non-owners to propose an update", async function () {
        await expect(contract.connect(addr1).proposeUpdate("1.1")).to.be.revertedWith("Not the contract owner");
    });

    it("Should allow users to vote for a proposal", async function () {
        await contract.proposeUpdate("1.1");
        await contract.connect(addr1).voteForUpdate("1.1");
        await contract.connect(addr2).voteForUpdate("1.1");

        expect(await contract.currentVersion()).to.equal("1.1");
    });

    it("Should not allow the same user to vote twice", async function () {
        await contract.proposeUpdate("1.1");
        await contract.connect(addr1).voteForUpdate("1.1");

        await expect(contract.connect(addr1).voteForUpdate("1.1")).to.be.revertedWith("You have already voted");
    });

    it("Should expire proposals after the duration", async function () {
        await contract.proposeUpdate("1.1");
        await ethers.provider.send("evm_increaseTime", [proposalDuration + 1]); // Move time forward
        await ethers.provider.send("evm_mine"); // Mine a new block

        await expect(contract.expireProposal("1.1")).to.be.revertedWith("Proposal is still valid");
    });

    it("Should allow the owner to expire a proposal", async function () {
        await contract.proposeUpdate("1.1");
        await ethers.provider.send("evm_increaseTime", [proposalDuration + 1]); // Move time forward
        await ethers.provider.send("evm_mine"); // Mine a new block

        await contract.expireProposal("1.1");
        const proposals = await contract.getProposals();
        expect(proposals).to.not.include("1.1");
    });

    it("Should not allow voting on expired proposals", async function () {
        await contract.proposeUpdate("1.1");
        await ethers.provider.send("evm_increaseTime", [proposalDuration + 1]); // Move time forward
        await ethers.provider.send("evm_mine"); // Mine a new block

        await expect(contract.connect(addr1).voteForUpdate("1.1")).to.be.revertedWith("Proposal has expired");
    });
});
