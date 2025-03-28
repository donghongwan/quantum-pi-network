# Eco-Regenerative Staking Mechanism

## Overview

The **Eco-Regenerative Staking Mechanism** allows users to stake Pi Coin to fund environmental regeneration projects, such as tree planting and renewable energy initiatives. By integrating IoT technology, this mechanism enables real-time contributions to environmental efforts, creating a sustainable blockchain ecosystem that attracts environmentally conscious investors.

## Features

- **EcoStaking Smart Contract**: A Solidity contract that manages staking, rewards, and project tracking.
- **EcoStaking API**: A Flask-based API that connects IoT sensors to the staking rewards system.
- **IoT Integration**: A Python script that simulates sending data from IoT devices to the EcoStaking API.
- **Dynamic Reward Calculation**: Rewards are calculated based on the amount staked and the duration of the stake.
- **Environmental Project Tracking**: Users can specify which environmental project their stake supports.

## Installation

### Prerequisites

- Node.js and npm (for deploying the smart contract)
- Python 3.x
- Flask
- Web3.py
- Qiskit (if applicable)

### Clone the Repository

```bash
git clone https://github.com/KOSASIH/quantum-pi-network.git
cd quantum-pi-network/eco-staking
```

### Deploy the EcoStaking Smart Contract

1. **Install Dependencies**:
   ```bash
   npm install @openzeppelin/contracts
   ```

2. **Compile and Deploy the Smart Contract**:
   - Ensure you have Hardhat or Truffle installed.
   - Compile and deploy the `EcoStaking.sol` contract using the following commands:
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network rinkeby
   ```

### Set Up the EcoStaking API

1. **Install Python Dependencies**:
   ```bash
   pip install Flask requests web3
   ```

2. **Run the EcoStaking API**:
   ```bash
   python EcoStakingAPI.py
   ```

### Set Up IoT Integration

1. **Run the IoT Integration Script**:
   ```bash
   python IoTIntegration.py
   ```

## Usage

### EcoStaking Smart Contract

- **Stake Pi Coin**:
   ```solidity
   ecoStaking.stake(amount, project);
   ```

- **Unstake Pi Coin**:
   ```solidity
   ecoStaking.unstake(amount);
   ```

- **Claim Rewards**:
   ```solidity
   ecoStaking.claimRewards();
   ```

### EcoStaking API

- **Send IoT Data**:
   - Send a POST request to the API endpoint with the project and amount:
   ```json
   {
       "project": "Tree Planting",
       "amount": 5
   }
   ```

### IoT Integration

- The `IoTIntegration.py` script simulates sending data from IoT devices to the EcoStaking API every few seconds. You can modify the parameters at the top of the script to adjust the project types and sending intervals.

## Conclusion

The Eco-Regenerative Staking Mechanism provides a powerful framework for integrating blockchain technology with environmental initiatives. By allowing users to stake Pi Coin and contribute to real-world projects, this feature promotes sustainability and attracts environmentally conscious investors. The combination of smart contracts, APIs, and IoT integration creates a robust ecosystem for eco-friendly investments.
