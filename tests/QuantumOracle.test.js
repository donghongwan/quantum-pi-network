// tests/QuantumOracle.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuantumOracle", function () {
    let QuantumOracle;
    let quantumOracle;
    let owner;
    let requester;

    beforeEach(async function () {
        // Deploy the QuantumOracle contract before each test
        QuantumOracle = await ethers.getContractFactory("QuantumOracle");
        [owner, requester] = await ethers.getSigners();
        quantumOracle = await QuantumOracle.deploy();
        await quantumOracle.deployed();
    });

    it("should allow users to request data", async function () {
        const query = "What is the weather today?";
        await quantumOracle.connect(requester).requestData(query);
        
        const request = await quantumOracle.getRequest(1);
        expect(request.requester).to.equal(requester.address);
        expect(request.query).to.equal(query);
        expect(request.fulfilled).to.be.false;
    });

    it("should fulfill a data request", async function () {
        const query = "What is the weather today?";
        await quantumOracle.connect(requester).requestData(query);
        
        const result = "Sunny";
        await quantumOracle.fulfillData(1, result);
        
        const request = await quantumOracle.getRequest(1);
        expect(request.fulfilled).to.be.true;
        expect(request.result).to.equal(result);
    });

    it("should not allow fulfilling an already fulfilled request", async function () {
        const query = "What is the weather today?";
        await quantumOracle.connect(requester).requestData(query);
        
        const result = "Sunny";
        await quantumOracle.fulfillData(1, result);
        
        await expect(quantumOracle.fulfillData(1, "Rainy")).to.be.revertedWith("Request already fulfilled");
    });

    it("should not allow fulfilling an expired request", async function () {
        const query = "What is the weather today?";
        await quantumOracle.connect(requester).requestData(query);
        
        // Fast forward time to simulate expiration
        await ethers.provider.send("evm_increaseTime", [86400 + 1]); // 1 day + 1 second
        await ethers.provider.send("evm_mine"); // Mine a new block

        await expect(quantumOracle.fulfillData(1, "Sunny")).to.be.revertedWith("Request has expired");
    });

    it("should emit events on data request and fulfillment", async function () {
        const query = "What is the weather today?";
        await expect(quantumOracle.connect(requester).requestData(query))
            .to.emit(quantumOracle, "DataRequested")
            .withArgs(1, requester.address, query);

        const result = "Sunny";
        await expect(quantumOracle.fulfillData(1, result))
            .to.emit(quantumOracle, "DataFulfilled")
            .withArgs(1, result);
    });

    it("should allow the owner to check for expired requests", async function () {
        const query = "What is the weather today?";
        await quantumOracle.connect(requester).requestData(query);
        
        // Fast forward time to simulate expiration
        await ethers.provider.send("evm_increaseTime", [86400 + 1]); // 1 day + 1 second
        await ethers.provider.send("evm_mine"); // Mine a new block

        await expect(quantumOracle.checkRequestExpiration(1))
            .to.emit(quantumOracle, "RequestExpired")
            .withArgs(1);
    });

    it("should allow batch fulfillment of requests", async function () {
        await quantumOracle.connect(requester).requestData("Query 1");
        await quantumOracle.connect(requester).requestData("Query 2");
        
        await quantumOracle.fulfillMultipleData([1, 2], ["Result 1", "Result 2"]);

        const request1 = await quantumOracle.getRequest(1);
        const request2 = await quantumOracle.getRequest(2);
        
        expect(request1.fulfilled).to.be.true;
        expect(request1.result).to.equal("Result 1");
        expect(request2.fulfilled).to.be.true;
        expect(request2.result).to.equal("Result 2");
    });
});
