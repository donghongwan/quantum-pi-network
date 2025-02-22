// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin contracts for Ownable, Pausable, AccessControl, and SafeMath
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title PiCoin
 * @dev This contract represents PiCoin, a stablecoin designed as a global stable digital currency.
 * It is pegged to a value of $314,159 (three hundred fourteen thousand one hundred fifty-nine) 
 * and includes features such as minting, burning, and access control.
 */
contract PiCoin is Ownable, Pausable, AccessControl {
    using SafeMath for uint256;

    // Define roles for minters and burners
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Stablecoin properties
    string public constant name = "PiCoin";
    string public constant symbol = "PI";
    uint256 public constant valueInUSD = 314159; // Fixed value of PiCoin in USD cents (i.e., $3141.59)

    // Mapping to track balances
    mapping(address => uint256) private balances;

    // Events for minting, burning, and balance updates
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event BalanceUpdated(address indexed account, uint256 newBalance);

    /**
     * @dev Constructor to initialize the contract and set up roles.
     */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Modifier to restrict access to minters
    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _;
    }

    // Modifier to restrict access to burners
    modifier onlyBurner() {
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _;
    }

    /**
     * @dev Mint new PiCoins to a specified address.
     * @param to The address to mint tokens to.
     * @param amount The amount of PiCoins to mint.
     */
    function mint(address to, uint256 amount) external onlyMinter {
        balances[to] = balances[to].add(amount);
        emit Minted(to, amount);
        emit BalanceUpdated(to, balances[to]);
    }

    /**
     * @dev Burn PiCoins from the caller's address.
     * @param amount The amount of PiCoins to burn.
     */
    function burn(uint256 amount) external onlyBurner {
        require(balances[msg.sender] >= amount, "Insufficient balance to burn");
        balances[msg.sender] = balances[msg.sender].sub(amount);
        emit Burned(msg.sender, amount);
        emit BalanceUpdated(msg.sender, balances[msg.sender]);
    }

    /**
     * @dev Get the balance of a specific address.
     * @param account The address to query the balance of.
     * @return The balance of the specified address.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /**
     * @dev Pause the contract, preventing minting and burning.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract, allowing minting and burning.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Override the before token transfer function to enforce the paused state.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal whenNotPaused {
        require(from == address(0) || balances[from] >= amount, "Insufficient balance for transfer");
    }
}
