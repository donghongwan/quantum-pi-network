# Fractal Governance Model

## Overview

The **Fractal Governance Model** enables a decentralized governance system based on fractal structures, where small communities (micro DAOs) replicate the global governance framework. This model allows for detailed and efficient participation, promoting scalability, reducing conflicts, and enhancing inclusivity within the Quantum Pi Network.

## Features

- **Hierarchical Governance Structure**: Supports multiple levels of governance, allowing DAOs to have child DAOs.
- **Voting Mechanism**: Implements a voting system for decision-making within each DAO.
- **Access Control**: Utilizes role-based access control to manage permissions for creating DAOs and voting.
- **Event Logging**: Emits events for DAO creation, voting, and decision outcomes for better tracking and transparency.
- **API Integration**: Provides a RESTful API for interacting with the fractal governance smart contract.

## Installation

### Prerequisites

- Node.js and npm (for deploying the smart contract)
- Python 3.x
- Flask
- Web3.py

### Clone the Repository

```bash
git clone https://github.com/KOSASIH/quantum-pi-network.git
cd quantum-pi-network/fractal-governance
```

### Deploy the FractalGovernance Smart Contract

1. **Install Dependencies**:
   ```bash
   npm install @openzeppelin/contracts
   ```

2. **Compile and Deploy the Smart Contract**:
   - Ensure you have Hardhat or Truffle installed.
   - Compile and deploy the `FractalGovernance.sol` contract using the following commands:
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network rinkeby
   ```

### Set Up the Fractal Governance API

1. **Install Python Dependencies**:
   ```bash
   pip install Flask requests web3
   ```

2. **Run the Fractal Governance API**:
   ```bash
   python FractalGovernanceAPI.py
   ```

## Usage

### FractalGovernance Smart Contract

- **Create a New DAO**:
   - Send a POST request to `/api/create-dao` to create a new DAO.

- **Add a Child DAO**:
   - Send a POST request to `/api/add-child-dao` with the parent DAO and child DAO addresses.

- **Vote on a DAO Decision**:
   - Send a POST request to `/api/vote` with the DAO ID and the number of votes.

### Fractal Governance API

- **Create DAO Endpoint**:
   ```http
   POST /api/create-dao
   ```

- **Add Child DAO Endpoint**:
   ```http
   POST /api/add-child-dao
   {
       "parent_dao": "0xParentDAOAddress",
       "child_dao": "0xChildDAOAddress"
   }
   ```

- **Vote Endpoint**:
   ```http
   POST /api/vote
   {
       "dao_id": 1,
       "vote_count": 5
   }
   ```

## Conclusion

The Fractal Governance Model provides a powerful framework for decentralized governance within the Quantum Pi Network. By allowing small communities to replicate the global governance structure, this feature promotes scalability and inclusivity, enabling efficient decision-making processes. The combination of smart contracts and a RESTful API creates a robust ecosystem for decentralized governance, paving the way for future advancements in community-driven initiatives.
