// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PiCoin is ERC20, Ownable {
    // Events for supply adjustments
    event SupplyIncreased(address indexed by, uint256 amount);
    event SupplyDecreased(address indexed by, uint256 amount);

    constructor(uint256 initialSupply) ERC20("PiCoin", "PI") {
        _mint(msg.sender, initialSupply * (10 ** decimals())); // Mint initial supply to the contract owner
    }

    /**
     * @dev Increase the token supply.
     * @param amount The amount to increase the supply by.
     */
    function increaseSupply(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, amount * (10 ** decimals())); // Mint new tokens
        emit SupplyIncreased(msg.sender, amount);
    }

    /**
     * @dev Decrease the token supply.
     * @param amount The amount to decrease the supply by.
     */
    function decreaseSupply(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount * (10 ** decimals()), "Insufficient balance to burn");
        _burn(msg.sender, amount * (10 ** decimals())); // Burn tokens
        emit SupplyDecreased(msg.sender, amount);
    }

    /**
     * @dev Get the current supply of tokens.
     * @return The total supply of tokens.
     */
    function getCurrentSupply() external view returns (uint256) {
        return totalSupply();
    }
}
