// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoStaking is Ownable {
    IERC20 public piCoin; // The Pi Coin token contract
    uint256 public totalStaked;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        string project; // Environmental project supported
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount, string project);
    event Unstaked(address indexed user, uint256 amount);
    event RewardDistributed(address indexed user, uint256 reward);

    constructor(IERC20 _piCoin) {
        piCoin = _piCoin;
    }

    function stake(uint256 amount, string memory project) external {
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(project).length > 0, "Project must be specified");

        // Transfer Pi Coin from user to contract
        piCoin.transferFrom(msg.sender, address(this), amount);
        
        // Update the user's stake
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        stakes[msg.sender].project = project;
        totalStaked += amount;

        emit Staked(msg.sender, amount, project);
    }

    function unstake(uint256 amount) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked amount");

        // Calculate rewards before unstaking
        uint256 reward = calculateReward(msg.sender);
        rewards[msg.sender] += reward;

        // Update the user's stake
        userStake.amount -= amount;
        totalStaked -= amount;
        piCoin.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
        emit RewardDistributed(msg.sender, reward);
    }

    function calculateReward(address user) public view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        // Reward calculation based on the amount staked and duration
        uint256 duration = block.timestamp - userStake.timestamp;
        uint256 reward = (userStake.amount * duration) / 1 days; // Example: 1 token per day per staked token
        return reward;
    }

    function claimRewards() external {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        rewards[msg.sender] = 0;
        piCoin.transfer(msg.sender, reward);
    }

    function getStakeInfo(address user) external view returns (uint256 amount, uint256 timestamp, string memory project) {
        Stake memory userStake = stakes[user];
        return (userStake.amount, userStake.timestamp, userStake.project);
    }
}
