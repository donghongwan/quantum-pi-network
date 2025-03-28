const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PiCoinTemporalValueAdjustment", function () {
    let piCoin;
    let owner;
    let addr1;

    beforeEach(async function () {
        // Deploy the contract before each test
        const PiCoin = await ethers.getContractFactory("PiCoinTemporalValueAdjustment");
        piCoin = await PiCoin.deploy();
        await piCoin.deployed();

        [owner, addr1] = await ethers.getSigners();
    });

    it("should have the correct initial value", async function () {
        const initialValue = await piCoin.getCurrentValue();
        expect(initialValue).to.equal(314159);
    });

    it("should adjust the value based on velocity", async function () {
        await piCoin.adjustValue(100000000); // Adjust for 100 million m/s
        const adjustedValue = await piCoin.getCurrentValue();
        expect(adjustedValue).to.be.above(314159); // Expect the value to increase
    });

    it("should not allow non-owner to adjust the value", async function () {
        await expect(piCoin.connect(addr1).adjustValue(100000000)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should reset the value to initial value", async function () {
        await piCoin.adjustValue(100000000); // Adjust for 100 million m/s
        await piCoin.resetValue();
        const currentValue = await piCoin.getCurrentValue();
        expect(currentValue).to.equal(314159);
    });

    it("should emit ValueAdjusted event on value adjustment", async function () {
        await expect(piCoin.adjustValue(100000000))
            .to.emit(piCoin, "ValueAdjusted")
            .withArgs(ethers.BigNumber.from("someExpectedValue"), anyValue); // Replace with expected value
    });

    it("should emit ValueReset event on value reset", async function () {
        await piCoin.adjustValue(100000000); // Adjust for 100 million m/s
        await expect(piCoin.resetValue())
            .to.emit(piCoin, "ValueReset")
            .withArgs(314159, anyValue); // Replace with expected timestamp
    });
});
