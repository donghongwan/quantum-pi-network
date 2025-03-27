// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuantumTimeStampedLedger Contract", function () {
    let QuantumTimeStampedLedger;
    let quantumTimeStampedLedger;
    let owner;
    let addr1;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        QuantumTimeStampedLedger = await ethers.getContractFactory("QuantumTimeStampedLedger");
        [owner, addr1] = await ethers.getSigners();

        // Deploy a new QuantumTimeStampedLedger contract for each test
        quantumTimeStampedLedger = await QuantumTimeStampedLedger.deploy();
        await quantumTimeStampedLedger.deployed();
    });

    describe("Add Entry", function () {
        it("Should add a single entry successfully", async function () {
            const data = "Sample Entry";
            const timestamp = 1633072800; // Example timestamp

            await quantumTimeStampedLedger.addEntry(data, timestamp);
            const entryCount = await quantumTimeStampedLedger.getEntryCount();
            expect(entryCount).to.equal(1);

            const entry = await quantumTimeStampedLedger.getEntry(0);
            expect(entry[0]).to.equal(data);
            expect(entry[1]).to.equal(timestamp);
        });

        it("Should add multiple entries successfully", async function () {
            const dataArray = ["Entry 1", "Entry 2", "Entry 3"];
            const timestampArray = [1633072800, 1633072900, 1633073000];

            await quantumTimeStampedLedger.addMultipleEntries(dataArray, timestampArray);
            const entryCount = await quantumTimeStampedLedger.getEntryCount();
            expect(entryCount).to.equal(3);

            for (let i = 0; i < dataArray.length; i++) {
                const entry = await quantumTimeStampedLedger.getEntry(i);
                expect(entry[0]).to.equal(dataArray[i]);
                expect(entry[1]).to.equal(timestampArray[i]);
            }
        });

        it("Should not allow non-owner to add an entry", async function () {
            const data = "Unauthorized Entry";
            const timestamp = 1633072800;

            await expect(
                quantumTimeStampedLedger.connect(addr1).addEntry(data, timestamp)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow empty data", async function () {
            const timestamp = 1633072800;

            await expect(
                quantumTimeStampedLedger.addEntry("", timestamp)
            ).to.be.revertedWith("Data cannot be empty");
        });

        it("Should not allow zero timestamp", async function () {
            const data = "Sample Entry";

            await expect(
                quantumTimeStampedLedger.addEntry(data, 0)
            ).to.be.revertedWith("Timestamp must be greater than zero");
        });
    });

    describe("Get Entries", function () {
        it("Should return the correct entry count", async function () {
            expect(await quantumTimeStampedLedger.getEntryCount()).to.equal(0);
            await quantumTimeStampedLedger.addEntry("First Entry", 1633072800);
            expect(await quantumTimeStampedLedger.getEntryCount()).to.equal(1);
        });

        it("Should return the correct entry by index", async function () {
            await quantumTimeStampedLedger.addEntry("First Entry", 1633072800);
            const entry = await quantumTimeStampedLedger.getEntry(0);
            expect(entry[0]).to.equal("First Entry");
            expect(entry[1]).to.equal(1633072800);
        });

        it("Should revert when accessing an invalid index", async function () {
            await quantumTimeStampedLedger.addEntry("First Entry", 1633072800);
            await expect(quantumTimeStampedLedger.getEntry(1)).to.be.revertedWith("Entry does not exist");
        });
    });
});
