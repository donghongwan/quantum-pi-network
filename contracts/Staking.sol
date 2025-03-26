// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Staking is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdateTime;
        uint256 lockupPeriod; // Custom lockup period for each stake
        bool exists;
    }

    IERC20 public piCoin;
    uint256 public baseRewardRate; // Base reward rate per block
    uint256 public totalStaked;

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 lockupPeriod);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event LockupPeriodUpdated(uint256 newLockupPeriod);
    event RewardRateUpdated(uint256 newRewardRate);
    event EmergencyWithdraw(address indexed user, uint256 amount, bool penaltyApplied);

    constructor(IERC20 _piCoin, uint256 _baseRewardRate) {
        piCoin = _piCoin;
        baseRewardRate = _baseRewardRate;
    }

    function stake(uint256 amount, uint256 _lockupPeriod) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(piCoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        Stake storage userStake = stakes[msg.sender];

        if (!userStake.exists) {
            userStake.exists = true;
            userStake.lastUpdateTime = block.timestamp;
        }

        userStake.amount = userStake.amount.add(amount);
        userStake.lockupPeriod = _lockupPeriod; // Set custom lockup period
        totalStaked = totalStaked.add(amount);

        emit Staked(msg.sender, amount, _lockupPeriod);
    }

    function unstake(uint256 amount) external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.exists, "No stake found");
        require(userStake.amount >= amount, "Insufficient staked amount");
        require(block.timestamp >= userStake.lastUpdateTime.add(userStake.lockupPeriod), "Tokens are locked");

        userStake.amount = userStake.amount.sub(amount);
        totalStaked = totalStaked.sub(amount);
        require(piCoin.transfer(msg.sender, amount), "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    function calculateReward(address user) public view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (!userStake.exists) return 0;

        uint256 elapsedTime = block.timestamp.sub(userStake.lastUpdateTime);
        return userStake.amount.mul(baseRewardRate).mul(elapsedTime).div(1e18); // Assuming rewardRate is in wei
    }

    function claimReward() external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.exists, "No stake found");

        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards to claim");

        userStake.rewardDebt = userStake.rewardDebt.add(reward);
        userStake.lastUpdateTime = block.timestamp; // Update last update time to current block

        require(piCoin.transfer(msg.sender, reward), "Transfer failed");

        emit RewardPaid(msg.sender, reward);
    }

    function emergencyWithdraw() external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.exists, "No stake found");

        uint256 amount = userStake.amount;
        userStake.amount = 0;
        totalStaked = totalStaked.sub(amount);

        // Apply a penalty if withdrawn before lockup period
        bool penaltyApplied = block.timestamp < userStake.lastUpdateTime.add(userStake.lockupPeriod);
        uint256 penaltyAmount = penaltyApplied ? amount.div(10) : 0; // 10% penalty

        require(piCoin.transfer(msg.sender, amount.sub(penaltyAmount)), "Transfer failed");

        emit EmergencyWithdraw(msg.sender, amount, penaltyApplied);
    }

    function updateBaseRewardRate(uint256 newBaseRewardRate) external onlyOwner {
        baseRewardRate = newBaseRewardRate;
        emit RewardRateUpdated(newBaseRewardRate);
    }

    function getStakeDetails(address user) external view returns (uint256 amount, uint256 rewardDebt, uint256 lastUpdateTime, uint256 lockupPeriod) {
        Stake storage userStake = stakes[user];
        require(userStake.exists, "No stake found");
        return (userStake.amount, userStake.rewardDebt, userStake.lastUpdateTime, userStake.lockupPeriod);
    }

    function totalRewardsAccrued(address user) external view returns (uint256) {
        return calculateReward(user).add(stakes[user].rewardDebt);
    }
}
