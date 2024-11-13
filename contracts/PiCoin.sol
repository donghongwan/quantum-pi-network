// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PiCoin is ERC20, Ownable, Pausable, AccessControl {
    using SafeMath for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 public transferFeePercentage = 2; // 2% transfer fee
    address public treasury; // Address to receive transfer fees

    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event TransferFeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);

    constructor(uint256 initialSupply, address _treasury) ERC20("PiCoin", "PI") {
        _mint(msg.sender, initialSupply);
        treasury = _treasury;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _;
    }

    modifier onlyBurner() {
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
        emit Minted(to, amount);
    }

    function burn(uint256 amount) external onlyBurner {
        _burn(msg.sender, amount);
        emit Burned(msg.sender, amount);
    }

    function setTransferFeePercentage(uint256 newFee) external onlyOwner {
        require(newFee <= 10, "Transfer fee cannot exceed 10%");
        transferFeePercentage = newFee;
        emit TransferFeeUpdated(newFee);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal override {
        uint256 fee = amount.mul(transferFeePercentage).div(100);
        uint256 amountAfterFee = amount.sub(fee);

        super._transfer(sender, recipient, amountAfterFee);
        super._transfer(sender, treasury, fee); // Transfer fee to treasury
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
