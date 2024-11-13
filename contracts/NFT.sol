// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint256) public royalties; // Royalties in basis points (1/100th of a percent)

    event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI, uint256 royalty);
    event RoyaltyUpdated(uint256 tokenId, uint256 newRoyalty);

    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(string memory _tokenURI, uint256 _royalty) public onlyOwner {
        require(_royalty <= 10000, "Royalty cannot exceed 100%"); // 100% = 10000 basis points
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        royalties[tokenId] = _royalty;

        emit NFTMinted(msg.sender, tokenId, _tokenURI, _royalty);
    }

    function mintBatch(string[] memory _tokenURIs, uint256[] memory royalties) public onlyOwner {
        require(_tokenURIs.length == royalties.length, "Arrays must have the same length");
        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            mint(_tokenURIs[i], royalties[i]);
        }
    }

    function updateRoyalty(uint256 tokenId, uint256 newRoyalty) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(newRoyalty <= 10000, "Royalty cannot exceed 100%");
        royalties[tokenId] = newRoyalty;
        emit RoyaltyUpdated(tokenId, newRoyalty);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }
}
