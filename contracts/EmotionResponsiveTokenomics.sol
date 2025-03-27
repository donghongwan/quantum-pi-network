// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EmotionResponsiveTokenomics is Ownable {
    IERC20 public token; // The ERC20 token used for rewards

    struct User {
        uint256 stakedAmount;
        uint256 lastReward;
        uint256 totalRewards;
    }

    mapping(address => User) public users;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsDistributed(address indexed user, uint256 reward);
    event RewardMultiplierUpdated(address indexed user, uint256 newMultiplier);

    constructor(IERC20 _token) {
        token = _token;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        token.transferFrom(msg.sender, address(this), amount);

        User storage user = users[msg.sender];
        user.stakedAmount += amount;
        user.lastReward = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        User storage user = users[msg.sender];
        require(user.stakedAmount >= amount, "Insufficient staked amount");

        user.stakedAmount -= amount;
        token.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function distributeRewards(uint256 heartRate, uint256 stressLevel) external {
        address userAddress = msg.sender;
        User storage user = users[userAddress];

        uint256 rewardMultiplier = calculateRewardMultiplier(heartRate, stressLevel);
        uint256 reward = (user.stakedAmount * rewardMultiplier) / 100; // Example calculation

        require(reward > 0, "No rewards to distribute");

        user.totalRewards += reward;
        user.lastReward = block.timestamp;

        token.transfer(userAddress, reward);
        emit RewardsDistributed(userAddress, reward);
        emit RewardMultiplierUpdated(userAddress, rewardMultiplier);
    }

    function calculateRewardMultiplier(uint256 heartRate, uint256 stressLevel) internal pure returns (uint256) {
        if (heartRate < 60 && stressLevel < 3) {
            return 200; // 200% reward for low stress and heart rate
        } else if (heartRate < 80 && stressLevel < 5) {
            return 100; // 100% reward for normal conditions
        } else {
            return 0; // No rewards for high stress
        }
    }

    function getUser Info(address userAddress) external view returns (uint256 stakedAmount, uint256 totalRewards) {
        User storage user = users[userAddress];
        return (user.stakedAmount, user.totalRewards);
    }
}
