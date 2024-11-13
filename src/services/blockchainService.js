// src/services/blockchainService.js

import Web3 from 'web3';
import config from '../main/config';
import MyContract from '../artifacts/MyContract.json'; // Import your contract's ABI

const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainUrl));
const contractAddress = process.env.CONTRACT_ADDRESS; // Set your contract address here
const myContract = new web3.eth.Contract(MyContract.abi, contractAddress);

// Function to get the current account
export const getCurrentAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
};

// Function to get data from the contract
export const getContractData = async (methodName, ...args) => {
    try {
        const data = await myContract.methods[methodName](...args).call();
        return data;
    } catch (error) {
        console.error('Error fetching contract data:', error);
        throw error.message;
    }
};

// Function to send a transaction to the contract
export const sendTransaction = async (methodName, ...args) => {
    const account = await getCurrentAccount();
    try {
        const transaction = await myContract.methods[methodName](...args).send({ from: account });
        return transaction;
    } catch (error) {
        console.error('Error sending transaction:', error);
        throw error.message;
    }
};

// Function to listen for events from the contract
export const listenForEvents = (eventName, callback) => {
    myContract.events[eventName]()
        .on('data', (event) => {
            console.log('Event received:', event);
            callback(event);
        })
        .on('error', (error) => {
            console.error('Error listening for events:', error);
        });
};

// Additional blockchain functions can be added here

export default {
    getCurrentAccount,
    getContractData,
    sendTransaction,
    listenForEvents,
};
