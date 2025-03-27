// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalConsciousness Contract", function () {
    let DigitalConsciousness;
    let digitalConsciousness;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        DigitalConsciousness = await ethers.getContractFactory("DigitalConsciousness");
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy a new DigitalConsciousness contract for each test
        digitalConsciousness = await DigitalConsciousness.deploy();
        await digitalConsciousness.deployed();
    });

    describe("Store Consciousness", function () {
        it("Should allow a user to store consciousness data", async function () {
            const encryptedData = ethers.utils.formatBytes32String("user1_data");
            const duration = 3600; // 1 hour

            await digitalConsciousness.connect(user1).storeConsciousness(encryptedData, duration);
            const userData = await digitalConsciousness.consciousnessData(user1.address);
            expect(userData.exists).to.be.true;
            expect(userData.encryptedData).to.equal(encryptedData);
        });

        it("Should not allow a user to store consciousness data twice", async function () {
            const encryptedData = ethers.utils.formatBytes32String("user1_data");
            const duration = 3600; // 1 hour

            await digitalConsciousness.connect(user1).storeConsciousness(encryptedData, duration);
            await expect(digitalConsciousness.connect(user1).storeConsciousness(encryptedData, duration))
                .to.be.revertedWith("Data already exists for this user");
        });
    });

    describe("Update Consciousness", function () {
        it("Should allow a user to update their consciousness data", async function () {
            const encryptedData = ethers.utils.formatBytes32String("user1_data");
            const newEncryptedData = ethers.utils.formatBytes32String("user1_new_data");
            const duration = 3600; // 1 hour

            await digitalConsciousness.connect(user1).storeConsciousness(encryptedData, duration);
            await digitalConsciousness.connect(user1).updateConsciousness(newEncryptedData, duration);

            const userData = await digitalConsciousness.consciousnessData(user1.address);
            expect(userData.encryptedData).to.equal(newEncryptedData);
        });

        it("Should not allow a user to update consciousness data if it doesn't exist", async function () {
            const newEncryptedData = ethers.utils.formatBytes32String("user1_new_data");
            const duration = 3600; // 1 hour

            await expect(digitalConsciousness.connect(user1).updateConsciousness(newEncryptedData, duration))
                .to.be.revertedWith("No data found for this user");
        });
    });

    describe("Retrieve Consciousness", function () {
        it("Should allow a user to retrieve their consciousness data", async function () {
            const encryptedData = ethers.utils.formatBytes32String("user1_data");
            const duration = 3600; // 1 hour

            await digitalConsciousness.connect(user1).storeConsciousness(encryptedData, duration);
            const retrievedData = await digitalConsciousness.connect(user1).retrieveConsciousness();
            expect(retrievedData).to.equal(encryptedData);
        });

        it("Should not allow a user to retrieve consciousness data if it has expired", async function () {
            const encryptedData = ethers.utils.formatBytes32String("user1_data");
            const duration = 1; // 1 second

            await digitalConsciousness.connect(user1).storeConsciousness(encryptedData, duration);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

            await expect(digitalConsciousness.connect(user1).retrieveConsciousness())
                .to.be.revertedWith("Data has expired");
        });

        it("Should not allow a user to retrieve consciousness data if it doesn't exist", async function () {
            await expect(digitalConsciousness.connect(user1).retrieveConsciousness())
                .to.be.revertedWith("No data found for this user");
        });
    });

    describe("Delete Consciousness", function () {
        it("Should allow a user to delete their consciousness data", async function () {
            const encryptedData = ethers.utils.formatBytes32String("user1_data");
            const duration = 3600; // 1 hour

            await digitalConsciousness.connect(user1).storeConsciousness(encryptedData, duration);
            await digitalConsciousness.connect(user1).deleteConsciousness();

            const userData = await digitalConsciousness.consciousnessData(user1.address);
            expect(userData.exists).to.be.false;
        });

        it("Should not allow a user to delete consciousness data if it doesn't exist", async function () {
            await expect(digitalConsciousness.connect(user1).deleteConsciousness())
                .to.be.revertedWith("No data found for this user");
        });
    });
});
