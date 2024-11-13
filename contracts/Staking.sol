// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Staking is Ownable {
    using SafeMath for uint256;

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdateTime;
        bool exists;
    }

    IERC20 public piCoin;
    uint256 public rewardRate; // Reward rate per block
    uint256 public lockupPeriod; // Lock-up period in seconds
    uint256 public totalStaked;

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event LockupPeriodUpdated(uint256 newLockupPeriod);
    event RewardRateUpdated(uint256 newRewardRate);

    constructor(IERC20 _piCoin, uint256 _rewardRate, uint256 _lockupPeriod) {
        piCoin = _piCoin;
        rewardRate = _rewardRate;
        lockupPeriod = _lockupPeriod;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(piCoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        Stake storage userStake = stakes[msg.sender];

        if (!userStake.exists) {
            userStake.exists = true;
            userStake.lastUpdateTime = block.timestamp;
        }

        userStake.amount = userStake.amount.add(amount);
        totalStaked = totalStaked.add(amount);

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.exists, "No stake found");
        require(userStake.amount >= amount, "Insufficient staked amount");
        require(block.timestamp >= userStake.lastUpdateTime.add(lockupPeriod), "Tokens are locked");

        userStake.amount = userStake.amount.sub(amount);
        totalStaked = totalStaked.sub(amount);
        require(piCoin.transfer(msg.sender, amount), "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    function calculateReward(address user) public view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (!userStake.exists) return 0;

        uint256 blocksStaked = block.number.sub(userStake.lastUpdateTime);
        return blocksStaked.mul(rewardRate).mul(userStake.amount).div(1e18); // Adjust for precision
    }

    function claimReward() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.exists, "No stake found");

        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No reward available");

        userStake.rewardDebt = userStake.rewardDebt.add(reward);
        userStake.lastUpdateTime = block.number; // Update last update time to current block

        require(piCoin.transfer(msg.sender, reward), "Transfer failed");

        emit RewardPaid(msg.sender, reward);
    }

    function setRewardRate(uint256 newRewardRate) external onlyOwner {
        rewardRate = newRewardRate;
        emit RewardRateUpdated(newRewardRate);
    }

    function setLockupPeriod(uint256 newLockupPeriod) external onlyOwner {
        lockupPeriod = newLockupPeriod;
        emit LockupPeriodUpdated(newLockupPeriod);
    }

    function emergencyWithdraw() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.exists, "No stake found");

        uint256 amount = userStake.amount;
        userStake.amount = 0; // Reset the stake amount
        totalStaked = totalStaked .sub(amount);
        require(piCoin.transfer(msg.sender, amount), "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    function getUser Stake(address user) external view returns (uint256 amount, uint256 rewardDebt, uint256 lastUpdateTime) {
        Stake storage userStake = stakes[user];
        return (userStake.amount, userStake.rewardDebt, userStake.lastUpdateTime);
    }
}
