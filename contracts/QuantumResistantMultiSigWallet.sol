// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title QuantumResistantMultiSigWallet
 * @dev A multi-signature wallet that requires multiple owners to approve transactions.
 */
contract QuantumResistantMultiSigWallet {
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public requiredSignatures;

    struct Transaction {
        address to;
        uint value;
        bool executed;
        uint signatureCount;
        mapping(address => bool) signatures;
        uint256 timestamp; // Timestamp for transaction expiration
    }

    Transaction[] public transactions;

    event TransactionCreated(uint indexed transactionId, address indexed to, uint value);
    event TransactionExecuted(uint indexed transactionId);
    event TransactionSigned(uint indexed transactionId, address indexed signer);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    modifier transactionExists(uint transactionId) {
        require(transactionId < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint transactionId) {
        require(!transactions[transactionId].executed, "Transaction already executed");
        _;
    }

    constructor(address[] memory _owners, uint _requiredSignatures) {
        require(_owners.length > 0, "Owners required");
        require(_requiredSignatures > 0 && _requiredSignatures <= _owners.length, "Invalid number of required signatures");

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner is not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }
        requiredSignatures = _requiredSignatures;
    }

    function createTransaction(address to, uint value) public onlyOwner {
        uint transactionId = transactions.length;
        Transaction storage newTransaction = transactions.push();
        newTransaction.to = to;
        newTransaction.value = value;
        newTransaction.executed = false;
        newTransaction.signatureCount = 0;
        newTransaction.timestamp = block.timestamp; // Set the timestamp for expiration

        emit TransactionCreated(transactionId, to, value);
    }

    function signTransaction(uint transactionId) public onlyOwner transactionExists(transactionId) notExecuted(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        require(!transaction.signatures[msg.sender], "Transaction already signed");

        transaction.signatures[msg.sender] = true;
        transaction.signatureCount += 1;

        emit TransactionSigned(transactionId, msg.sender);

        if (transaction.signatureCount >= requiredSignatures) {
            executeTransaction(transactionId);
        }
    }

    function executeTransaction(uint transactionId) internal transactionExists(transactionId) notExecuted(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        require(transaction.signatureCount >= requiredSignatures, "Not enough signatures");
        require(block.timestamp <= transaction.timestamp + 1 days, "Transaction has expired"); // 1 day expiration

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}("");
        require(success, "Transaction failed");

        emit TransactionExecuted(transactionId);
    }

    function addOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        require(!isOwner[newOwner], "Owner is not unique");
        isOwner[newOwner] = true;
        owners.push(newOwner);
        emit OwnerAdded(newOwner);
    }

    function removeOwner(address ownerToRemove) public onlyOwner {
        require(isOwner[ownerToRemove], "Not an owner");
        isOwner[ownerToRemove] = false;

        // Remove the owner from the owners array
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == ownerToRemove) {
                owners[i] = owners[owners.length - 1];
                owners.pop();
                break;
            }
        }
        emit OwnerRemoved(ownerToRemove);
    }

    receive() external payable {}
}
