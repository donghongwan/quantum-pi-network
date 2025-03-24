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
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(abi, contractAddress);
        console.log("Web3 initialized and contract loaded.");
    } else {
        alert('Please install MetaMask!');
    }
};

// Function to request data from the oracle
async function requestData() {
    const query = document.getElementById('query').value;
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.requestData(query).send({ from: accounts[0] });
        alert('Data request submitted successfully!');
    } catch (error) {
        alert('Error submitting request: ' + error.message);
    }
}

// Function to fulfill a data request
async function fulfillData(requestId, result) {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.fulfillData(requestId, result).send({ from: accounts[0] });
        alert('Data request fulfilled successfully!');
    } catch (error) {
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
        alert('Error retrieving request: ' + error.message);
    }
}
