// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Interface for price feed oracle
interface IPriceFeed {
    function getLatestPrice() external view returns (uint256);
}

// Synthetic Asset Contract
contract SyntheticAssets is ERC20, Ownable {
    using SafeMath for uint256;

    // Mapping of synthetic asset names to their underlying asset
    mapping(string => address) public underlyingAssets;
    mapping(string => uint256) public collateralizationRatio; // e.g., 150 for 150%
    mapping(string => address) public priceFeeds; // Price feed for each synthetic asset

    event SyntheticAssetCreated(string indexed name, address indexed underlyingAsset, uint256 collateralization);
    event SyntheticAssetMinted(string indexed name, address indexed to, uint256 amount);
    event SyntheticAssetBurned(string indexed name, address indexed from, uint256 amount);

    constructor() ERC20("Synthetic Asset Token", "SAT") {}

    // Create a new synthetic asset
    function createSyntheticAsset(
        string memory name,
        address underlyingAsset,
        uint256 collateralization,
        address priceFeed
    ) external onlyOwner {
        require(underlyingAssets[name] == address(0), "Asset already exists");
        require(collateralization > 100, "Collateralization must be greater than 100%");

        underlyingAssets[name] = underlyingAsset;
        collateralizationRatio[name] = collateralization;
        priceFeeds[name] = priceFeed;

        emit SyntheticAssetCreated(name, underlyingAsset, collateralization);
    }

    // Mint synthetic assets
    function mintSyntheticAsset(string memory name, uint256 amount) external {
        require(underlyingAssets[name] != address(0), "Asset does not exist");

        uint256 price = IPriceFeed(priceFeeds[name]).getLatestPrice();
        uint256 requiredCollateral = amount.mul(price).mul(collateralizationRatio[name]).div(100);

        // Transfer the required collateral from the user to the contract
        ERC20(underlyingAssets[name]).transferFrom(msg.sender, address(this), requiredCollateral);

        // Mint synthetic assets
        _mint(msg.sender, amount);

        emit SyntheticAssetMinted(name, msg.sender, amount);
    }

    // Burn synthetic assets
    function burnSyntheticAsset(string memory name, uint256 amount) external {
        require(underlyingAssets[name] != address(0), "Asset does not exist");

        // Burn the synthetic assets
        _burn(msg.sender, amount);

        // Calculate the amount of collateral to return
        uint256 price = IPriceFeed(priceFeeds[name]).getLatestPrice();
        uint256 collateralToReturn = amount.mul(price).div(collateralizationRatio[name]);

        // Transfer the collateral back to the user
        ERC20(underlyingAssets[name]).transfer(msg.sender, collateralToReturn);

        emit SyntheticAssetBurned(name, msg.sender, amount);
    }

    // Get the current price of the synthetic asset
    function getCurrentPrice(string memory name) external view returns (uint256) {
        require(underlyingAssets[name] != address(0), "Asset does not exist");
        return IPriceFeed(priceFeeds[name]).getLatestPrice();
    }
}
