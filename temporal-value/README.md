# Pi Coin Temporal Value Adjustment

## Overview

The **Pi Coin Temporal Value Adjustment** smart contract implements a mechanism to adjust the value of Pi Coin based on relativistic effects, specifically time dilation, using the Lorentz factor from special relativity. This allows Pi Coin to be relevant in high-speed environments, such as satellites or spacecraft, making it the first currency designed for a space-time economy.

## Features

- **Dynamic Value Adjustment**: The value of Pi Coin adjusts based on the velocity of the observer, reflecting the effects of special relativity.
- **Access Control**: Only the contract owner can adjust or reset the value of Pi Coin, ensuring security and integrity.
- **Event Logging**: Detailed events are emitted for value adjustments and resets, providing transparency and traceability.
- **Precision Calculations**: Fixed-point arithmetic is used to ensure accurate financial calculations.
- **Gas Optimization**: The contract is designed to minimize gas consumption for efficient transactions.

## Mathematical Model

The Lorentz factor (\( \gamma \)) is calculated using the formula:

\[
\gamma = \frac{1}{\sqrt{1 - \frac{v^2}{c^2}}}
\]

Where:
- \( v \) is the velocity of the observer.
- \( c \) is the speed of light (approximately \( 299,792,458 \) m/s).

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/KOSASIH/quantum-pi-network.git
   cd quantum-pi-network/temporal-value
   ```

2. **Install Dependencies**:
   Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then, install Hardhat and OpenZeppelin:
   ```bash
   npm install --save-dev hardhat @openzeppelin/contracts
   ```

3. **Compile the Smart Contract**:
   ```bash
   npx hardhat compile
   ```

## Usage

### Deploying the Smart Contract

1. Create a deployment script in the `scripts` directory (e.g., `deploy.js`):
   ```javascript
   async function main() {
       const PiCoin = await ethers.getContractFactory("PiCoinTemporalValueAdjustment");
       const piCoin = await PiCoin.deploy();
       await piCoin.deployed();
       console.log("Pi Coin deployed to:", piCoin.address);
   }

   main()
       .then(() => process.exit(0))
       .catch((error) => {
           console.error(error);
           process.exit(1);
       });
   ```

2. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy.js --network yourNetwork
   ```

### Interacting with the Smart Contract

1. **Adjusting the Value**:
   Call the `adjustValue` function with the velocity (in m/s) to update the value of Pi Coin based on relativistic effects:
   ```javascript
   await piCoin.adjustValue(100000000); // Adjust for 100 million m/s
   ```

2. **Getting the Current Value**:
   Retrieve the current adjusted value of Pi Coin:
   ```javascript
   const currentValue = await piCoin.getCurrentValue();
   console.log("Current Value of Pi Coin:", currentValue.toString());
   ```

3. **Resetting the Value**:
   Reset the value of Pi Coin to its initial value:
   ```javascript
   await piCoin.resetValue();
   ```

## Example

```javascript
// Example of adjusting the value of Pi Coin
const velocity = 100000000; // 100 million m/s
await piCoin.adjustValue(velocity);
const currentValue = await piCoin.getCurrentValue();
console.log("Adjusted Value of Pi Coin:", currentValue.toString());
```

## Conclusion

This implementation positions Pi Coin as a pioneering currency for space-time economies, adapting to the unique challenges of high-speed travel and exploration. The smart contract is designed to be secure, efficient, and transparent, making it suitable for future applications in interplanetary commerce.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
