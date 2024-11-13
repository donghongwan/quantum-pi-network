// config/networkConfig.js

const networkConfig = {
    1: { // Ethereum Mainnet
        name: "Ethereum Mainnet",
        rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        blockExplorerUrl: "https://etherscan.io",
        gasPrice: "20000000000", // 20 Gwei
        contracts: {
            PiCoin: "0xYourPiCoinContractAddress",
            Governance: "0xYourGovernanceContractAddress",
        },
    },
    3: { // Ropsten Testnet
        name: "Ropsten Testnet",
        rpcUrl: "https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        blockExplorerUrl: "https://ropsten.etherscan.io",
        gasPrice: "20000000000", // 20 Gwei
        contracts: {
            PiCoin: "0xYourPiCoinContractAddress",
            Governance: "0xYourGovernanceContractAddress",
        },
    },
    4: { // Rinkeby Testnet
        name: "Rinkeby Testnet",
        rpcUrl: "https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        blockExplorerUrl: "https://rinkeby.etherscan.io",
        gasPrice: "20000000000", // 20 Gwei
        contracts: {
            PiCoin: "0xYourPiCoinContractAddress",
            Governance: "0xYourGovernanceContractAddress",
        },
    },
    1337: { // Local Development
        name: "Local Development",
        rpcUrl: "http://127.0.0.1:8545",
        blockExplorerUrl: "",
        gasPrice: "20000000000", // 20 Gwei
        contracts: {
            PiCoin: "",
            Governance: "",
        },
    },
};

const getNetworkConfig = (networkId) => {
    return networkConfig[networkId] || networkConfig[1337]; // Default to local if not found
};

module.exports = {
    networkConfig,
    getNetworkConfig,
};
