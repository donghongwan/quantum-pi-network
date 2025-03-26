// Replace with your contract address and ABI
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
const abi = [
    // Replace with your contract ABI
    {
        "inputs": [],
        "name": "requestCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": ["string"],
        "name": "requestData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": ["uint256", "string"],
        "name": "fulfillData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": ["uint256"],
        "name": "getRequest",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "requester",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "query",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "fulfilled",
                        "type": "bool"
                    },
                    {
                        "internalType": "string",
                        "name": "result",
                        "type": "string"
                    }
                ],
                "internalType": "struct QuantumOracle.DataRequest",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            contract = new web3.eth.Contract(abi, contractAddress);
            console.log("Web3 initialized and contract loaded.");
        } catch (error) {
            console.error("Error connecting to MetaMask: ", error);
            alert('Error connecting to MetaMask: ' + error.message);
        }
    } else {
        alert('Please install MetaMask!');
    }
};

// Function to request data from the oracle
async function requestData() {
    const query = document.getElementById('query').value;
    const accounts = await web3.eth.getAccounts();
    try {
        const tx = await contract.methods.requestData(query).send({ from: accounts[0] });
        console.log('Transaction successful:', tx);
        alert('Data request submitted successfully!');
    } catch (error) {
        console.error('Error submitting request: ', error);
        alert('Error submitting request: ' + error.message);
    }
}

// Function to fulfill a data request
async function fulfillData() {
    const requestId = document.getElementById('requestId').value;
    const result = document.getElementById('result').value;
    const accounts = await web3.eth.getAccounts();
    try {
        const tx = await contract.methods.fulfillData(requestId, result).send({ from: accounts[0] });
        console.log('Transaction successful:', tx);
        alert('Data request fulfilled successfully!');
    } catch (error) {
        console.error('Error fulfilling request: ', error);
        alert('Error fulfilling request: ' + error.message);
    }
}

// Function to view the status of a data request
async function viewRequest() {
    const requestId = document.getElementById('viewRequestId').value;
    try {
        const request = await contract.methods.getRequest(requestId).call();
        const details = `
            Requester: ${request.requester}
            Query: ${request.query}
            Fulfilled: ${request.fulfilled}
            Result: ${request.result}
        `;
        document.getElementById('requestDetails').innerText = details;
    } catch (error) {
        console.error('Error retrieving request: ', error);
        alert('Error retrieving request: ' + error.message);
    }
                        }
