const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contract", function () {
    let staking;
    let mockToken;
    let owner;
    let addr1;
    let addr2;
    const initialSupply = ethers.utils.parseEther("10000");
    const baseRewardRate = ethers.utils.parseEther("0.01"); // Reward rate per second
    const lockupPeriod = 60; // 60 seconds for testing

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy Mock ERC20 Token
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        mockToken = await MockERC20.deploy(initialSupply);
        await mockToken.deployed();

        // Deploy Staking Contract
        const Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(mockToken.address, baseRewardRate);
        await staking.deployed();

        // Transfer some tokens to addr1 and addr2 for testing
        await mockToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
        await mockToken.transfer(addr2.address, ethers.utils.parseEther("1000"));
    });

    it("Should allow users to stake tokens", async function () {
        await mockToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));
        await staking.connect(addr1).stake(ethers.utils.parseEther("100"), lockupPeriod);

        const stake = await staking.stakes(addr1.address);
        expect(stake.amount).to.equal(ethers.utils.parseEther("100"));
        expect(stake.lockupPeriod).to.equal(lockupPeriod);
    });

    it("Should allow users to unstake tokens after lockup period", async function () {
        await mockToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));
        await staking.connect(addr1).stake(ethers.utils.parseEther("100"), lockupPeriod);

        // Fast forward time
        await ethers.provider.send("evm_increaseTime", [lockupPeriod + 1]);
        await ethers.provider.send("evm_mine"); // Mine a new block

        await staking.connect(addr1).unstake(ethers.utils.parseEther("100"));
        const stake = await staking.stakes(addr1.address);
        expect(stake.amount).to.equal(0);
    });

    it("Should not allow users to unstake tokens before lockup period", async function () {
        await mockToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));
        await staking.connect(addr1).stake(ethers.utils.parseEther("100"), lockupPeriod);

        await expect(staking.connect(addr1).unstake(ethers.utils.parseEther("100"))).to.be.revertedWith("Tokens are locked");
    });

    it("Should allow users to claim rewards", async function () {
        await mockToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));
        await staking.connect(addr1).stake(ethers.utils.parseEther("100"), lockupPeriod);

        // Fast forward time to accumulate rewards
        await ethers.provider.send("evm_increaseTime", [lockupPeriod + 1]);
        await ethers.provider.send("evm_mine"); // Mine a new block

        await staking.connect(addr1).claimReward();
        const stake = await staking.stakes(addr1.address);
        expect(stake.reward Debt).to.be.above(0);
    });

    it("Should allow emergency withdrawal with penalty", async function () {
        await mockToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));
        await staking.connect(addr1).stake(ethers.utils.parseEther("100"), lockupPeriod);

        // Attempt emergency withdraw before lockup period
        await staking.connect(addr1).emergencyWithdraw();
        const stake = await staking.stakes(addr1.address);
        expect(stake.amount).to.equal(0);
    });

    it("Should not allow emergency withdrawal if no stake exists", async function () {
        await expect(staking.connect(addr1).emergencyWithdraw()).to.be.revertedWith("No stake found");
    });

    it("Should update the base reward rate", async function () {
        const newRewardRate = ethers.utils.parseEther("0.02");
        await staking.connect(owner).updateBaseRewardRate(newRewardRate);
        expect(await staking.baseRewardRate()).to.equal(newRewardRate);
    });

    it("Should return stake details correctly", async function () {
        await mockToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));
        await staking.connect(addr1).stake(ethers.utils.parseEther("100"), lockupPeriod);

        const details = await staking.getStakeDetails(addr1.address);
        expect(details.amount).to.equal(ethers.utils.parseEther("100"));
        expect(details.lockupPeriod).to.equal(lockupPeriod);
    });

    it("Should calculate total rewards accrued correctly", async function () {
        await mockToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));
        await staking.connect(addr1).stake(ethers.utils.parseEther("100"), lockupPeriod);

        // Fast forward time to accumulate rewards
        await ethers.provider.send("evm_increaseTime", [lockupPeriod + 1]);
        await ethers.provider.send("evm_mine"); // Mine a new block

        const totalRewards = await staking.totalRewardsAccrued(addr1.address);
        expect(totalRewards).to.be.above(0);
    });
});
