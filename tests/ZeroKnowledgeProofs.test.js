const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZeroKnowledgeProofs", function () {
    let zkProofs;
    let owner;
    let addr1;

    beforeEach(async function () {
        // Deploy the contract before each test
        const ZeroKnowledgeProofs = await ethers.getContractFactory("ZeroKnowledgeProofs");
        zkProofs = await ZeroKnowledgeProofs.deploy();
        await zkProofs.deployed();

        [owner, addr1] = await ethers.getSigners();
    });

    it("should generate a proof correctly", async function () {
        const dataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test data"));
        const proofHash = await zkProofs.generateProof(dataHash);

        const proofDetails = await zkProofs.getProofDetails(proofHash);
        expect(proofDetails.prover).to.equal(owner.address);
        expect(proofDetails.proofHash).to.equal(proofHash);
    });

    it("should verify a valid proof correctly", async function () {
        const dataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test data"));
        const proofHash = await zkProofs.generateProof(dataHash);

        await expect(zkProofs.verifyProof(proofHash, dataHash))
            .to.emit(zkProofs, "ProofVerified")
            .withArgs(proofHash, owner.address, true);
    });

    it("should not verify an invalid proof", async function () {
        const dataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test data"));
        const proofHash = await zkProofs.generateProof(dataHash);

        const invalidDataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("invalid data"));
        await expect(zkProofs.verifyProof(proofHash, invalidDataHash))
            .to.emit(zkProofs, "ProofVerified")
            .withArgs(proofHash, owner.address, false);
    });

    it("should revert when verifying a non-existent proof", async function () {
        const nonExistentProofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("non-existent proof"));
        await expect(zkProofs.verifyProof(nonExistentProofHash, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test data"))))
            .to.be.revertedWith("Proof does not exist");
    });
});
