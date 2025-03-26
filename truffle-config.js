const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
require('dotenv').config(); // Load environment variables from .env file

const infuraKey = process.env.INFURA_KEY; // Your Infura project ID
const mnemonic = process.env.MNEMONIC; // Your wallet mnemonic

// Validate environment variables
if (!infuraKey || !mnemonic) {
    console.error("Error: Please set your INFURA_KEY and MNEMONIC in the .env file.");
    process.exit(1);
}

module.exports = {
    // Specify the Solidity compiler version
    compilers: {
        solc: {
            version: "0.8.0", // Specify the version of Solidity you are using
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    },
    
    // Configure networks
    networks: {
        development: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 7545, // Ganache port (default: 8545)
            network_id: "*", // Any network (default: none)
        },
        ropsten: {
            provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
            network_id: 3, // Ropsten's id
            gas: 5500000, // Ropsten has a lower block limit than mainnet
            confirmations: 2, // # of confs to wait between deployments. (default: 0)
            timeoutBlocks: 200, // # of blocks before a deployment times out (minimum/default: 50)
            skipDryRun: true // Skip dry run before migrations? (default: false for public nets)
        },
        mainnet: {
            provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraKey}`),
            network_id: 1, // Mainnet's id
            gas: 5500000, // Mainnet has a lower block limit than mainnet
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },
        kovan: {
            provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraKey}`),
            network_id: 42, // Kovan's id
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },
        rinkeby: {
            provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
            network_id: 4, // Rinkeby's id
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        }
    }
};
