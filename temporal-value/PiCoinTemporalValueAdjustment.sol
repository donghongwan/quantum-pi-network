// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PiCoinTemporalValueAdjustment is Ownable {
    string public name = "Pi Coin";
    string public symbol = "PI";
    uint256 public constant INITIAL_VALUE = 314159; // Initial value of Pi Coin
    uint256 public currentValue;
    uint256 public lastUpdateTime;

    event ValueAdjusted(uint256 newValue, uint256 timestamp, uint256 velocity);
    event ValueReset(uint256 resetValue, uint256 timestamp);

    constructor() {
        currentValue = INITIAL_VALUE;
        lastUpdateTime = block.timestamp;
    }

    // Function to calculate the Lorentz factor
    function lorentzFactor(uint256 velocity) public pure returns (uint256) {
        uint256 c = 299792458; // Speed of light in m/s
        require(velocity < c, "Velocity must be less than the speed of light.");
        
        // Calculate the Lorentz factor with fixed-point arithmetic
        uint256 gamma = 1e18 / sqrt(1e36 - (velocity * velocity * 1e36) / (c * c));
        return gamma;
    }

    // Function to adjust the value of Pi Coin based on velocity
    function adjustValue(uint256 velocity) public onlyOwner {
        uint256 gamma = lorentzFactor(velocity);
        
        // Adjust the current value based on the Lorentz factor
        currentValue = (INITIAL_VALUE * gamma) / 1e18; // Adjusting for precision
        lastUpdateTime = block.timestamp;

        emit ValueAdjusted(currentValue, lastUpdateTime, velocity);
    }

    // Function to reset the value of Pi Coin to its initial value
    function resetValue() public onlyOwner {
        currentValue = INITIAL_VALUE;
        lastUpdateTime = block.timestamp;

        emit ValueReset(currentValue, lastUpdateTime);
    }

    // Function to get the current value of Pi Coin
    function getCurrentValue() public view returns (uint256) {
        return currentValue;
    }

    // Function to calculate square root (using Babylonian method)
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
