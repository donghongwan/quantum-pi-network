// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HolographicNFTMarketplace is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct NFT {
        uint256 id;
        string tokenURI;
        address owner;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => NFT) public nfts;

    event NFTMinted(uint256 indexed id, string tokenURI, address indexed owner);
    event NFTListed(uint256 indexed id, uint256 price);
    event NFTSold(uint256 indexed id, address indexed buyer, uint256 price);
    event NFTTransferred(uint256 indexed id, address indexed from, address indexed to);

    constructor() ERC721("HolographicNFT", "HNFT") {}

    function mintNFT(string memory tokenURI) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _mint(msg.sender, tokenId);
        _tokenIdCounter.increment();

        nfts[tokenId] = NFT({
            id: tokenId,
            tokenURI: tokenURI,
            owner: msg.sender,
            price: 0,
            forSale: false
        });

        emit NFTMinted(tokenId, tokenURI, msg.sender);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "You do not own this NFT");
        require(price > 0, "Price must be greater than zero");

        nfts[tokenId].price = price;
        nfts[tokenId].forSale = true;

        emit NFTListed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) external payable {
        require(nfts[tokenId].forSale, "NFT is not for sale");
        require(msg.value >= nfts[tokenId].price, "Insufficient funds sent");

        address seller = nfts[tokenId].owner;

        // Transfer the NFT
        _transfer(seller, msg.sender, tokenId);

        // Update NFT ownership
        nfts[tokenId].owner = msg.sender;
        nfts[tokenId].forSale = false;

        // Transfer funds to the seller
        payable(seller).transfer(msg.value);

        emit NFTSold(tokenId, msg.sender, nfts[tokenId].price);
        emit NFTTransferred(tokenId, seller, msg.sender);
    }

    function getNFTDetails(uint256 tokenId) external view returns (NFT memory) {
        return nfts[tokenId];
    }
}
