const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
    let NFT;
    let nft;
    let owner;
    let user1;

    beforeEach(async function () {
        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy();
        [owner, user1] = await ethers.getSigners();
    });

    it("should mint an NFT", async function () {
        const tokenURI = "https://example.com/token/1";
        const royalty = 500await nft.mint(tokenURI, royalty);
        const tokenId = 0; // First token ID
        expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
        expect(await nft.tokenURI(tokenId)).to.equal(tokenURI);
        expect(await nft.royalties(tokenId)).to.equal(royalty);
    });

    it("should batch mint NFTs", async function () {
        const tokenURIs = ["https://example.com/token/1", "https://example.com/token/2"];
        const royalties = [500, 1000]; // 5% and 10%
        await nft.mintBatch(tokenURIs, royalties);
        
        for (let i = 0; i < tokenURIs.length; i++) {
            expect(await nft.ownerOf(i)).to.equal(owner.address);
            expect(await nft.tokenURI(i)).to.equal(tokenURIs[i]);
            expect(await nft.royalties(i)).to.equal(royalties[i]);
        }
    });

    it("should update royalty for an NFT", async function () {
        const tokenURI = "https://example.com/token/1";
        const royalty = 500;
        await nft.mint(tokenURI, royalty);
        const tokenId = 0;

        const newRoyalty = 800; // Update to 8%
        await nft.updateRoyalty(tokenId, newRoyalty);
        expect(await nft.royalties(tokenId)).to.equal(newRoyalty);
    });

    it("should revert when trying to update royalty for a non-existent token", async function () {
        await expect(nft.updateRoyalty(999, 500))
            .to.be.revertedWith("Token does not exist");
    });
});
