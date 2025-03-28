const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DarkPoolDEX", function () {
    let darkPoolDEX;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Deploy the contract before each test
        const DarkPoolDEX = await ethers.getContractFactory("DarkPoolDEX");
        darkPoolDEX = await DarkPoolDEX.deploy();
        await darkPoolDEX.deployed();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("should place an order correctly", async function () {
        await darkPoolDEX.placeOrder(100, 2000, true); // Place a buy order for 100 units at a price of 2000
        const order = await darkPoolDEX.getOrder(0);
        expect(order.trader).to.equal(owner.address);
        expect(order.amount).to.equal(100);
        expect(order.price).to.equal(2000);
        expect(order.isBuyOrder).to.equal(true);
        expect(order.isExecuted).to.equal(false);
        expect(order.isCancelled).to.equal(false);
    });

    it("should execute an order correctly", async function () {
        await darkPoolDEX.placeOrder(100, 2000, true); // Place a buy order
        await darkPoolDEX.executeOrder(0); // Execute the order
        const order = await darkPoolDEX.getOrder(0);
        expect(order.isExecuted).to.equal(true);
    });

    it("should not allow non-owner to execute an order", async function () {
        await darkPoolDEX.placeOrder(100, 2000, true); // Place a buy order
        await expect(darkPoolDEX.connect(addr1).executeOrder(0)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should cancel an order correctly", async function () {
        await darkPoolDEX.placeOrder(100, 2000, true); // Place a buy order
        await darkPoolDEX.cancelOrder(0); // Cancel the order
        const order = await darkPoolDEX.getOrder(0);
        expect(order.isCancelled).to.equal(true);
    });

    it("should not allow a trader to cancel an executed order", async function () {
        await darkPoolDEX.placeOrder(100, 2000, true); // Place a buy order
        await darkPoolDEX.executeOrder(0); // Execute the order
        await expect(darkPoolDEX.cancelOrder(0)).to.be.revertedWith("Cannot cancel an executed order");
    });

    it("should emit OrderPlaced event on order placement", async function () {
        await expect(darkPoolDEX.placeOrder(100, 2000, true))
            .to.emit(darkPoolDEX, "OrderPlaced")
            .withArgs(0, owner.address, 100, 2000, true);
    });

    it("should emit OrderExecuted event on order execution", async function () {
        await darkPoolDEX.placeOrder(100, 2000, true); // Place a buy order
        await expect(darkPoolDEX.executeOrder(0))
            .to.emit(darkPoolDEX, "OrderExecuted")
            .withArgs(0, owner.address, 100, 2000);
    });

    it("should emit OrderCancelled event on order cancellation", async function () {
        await darkPoolDEX.placeOrder(100, 2000, true); // Place a buy order
        await expect(darkPoolDEX.cancelOrder(0))
            .to.emit(darkPoolDEX, "OrderCancelled")
            .withArgs(0, owner.address);
    });
});
