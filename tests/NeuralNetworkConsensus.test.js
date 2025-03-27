// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeuralNetworkConsensus Contract", function () {
    let NeuralNetworkConsensus;
    let neuralNetworkConsensus;
    let owner;
    let validator1;
    let validator2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        NeuralNetworkConsensus = await ethers.getContractFactory("NeuralNetworkConsensus");
        [owner, validator1, validator2] = await ethers.getSigners();

        // Deploy a new NeuralNetworkConsensus contract for each test
        neuralNetworkConsensus = await NeuralNetworkConsensus.deploy();
        await neuralNetworkConsensus.deployed();
    });

    describe("Validator Management", function () {
        it("Should allow the owner to add a validator", async function () {
            await neuralNetworkConsensus.addValidator(validator1.address);
            expect(await neuralNetworkConsensus.validators(validator1.address)).to.be.true;
        });

        it("Should allow the owner to remove a validator", async function () {
            await neuralNetworkConsensus.addValidator(validator1.address);
            await neuralNetworkConsensus.removeValidator(validator1.address);
            expect(await neuralNetworkConsensus.validators(validator1.address)).to.be.false;
        });

        it("Should not allow non-owners to add or remove validators", async function () {
            await expect(neuralNetworkConsensus.connect(validator1).addValidator(validator2.address))
                .to.be.revertedWith("Ownable: caller is not the owner");

            await expect(neuralNetworkConsensus.connect(validator1).removeValidator(validator2.address))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Transaction Validation", function () {
        beforeEach(async function () {
            // Add validator1 to the list of validators
            await neuralNetworkConsensus.addValidator(validator1.address);
        });

        it("Should allow an authorized validator to validate a transaction", async function () {
            const modelInput = "0x123456"; // Example input data

            await expect(neuralNetworkConsensus.connect(validator1).validateTransaction(modelInput))
                .to.emit(neuralNetworkConsensus, "TransactionValidated")
                .withArgs(validator1.address, true, modelInput);
        });

        it("Should not allow unauthorized validators to validate a transaction", async function () {
            const modelInput = "0x123456"; // Example input data

            await expect(neuralNetworkConsensus.connect(validator2).validateTransaction(modelInput))
                .to.be.revertedWith("Not an authorized validator");
        });
    });
});
