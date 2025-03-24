// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    }

    Transaction[] public transactions;

    event TransactionCreated(uint indexed transactionId, address indexed to, uint value);
    event TransactionExecuted(uint indexed transactionId);
    event TransactionSigned(uint indexed transactionId, address indexed signer);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
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

        emit TransactionCreated(transactionId, to, value);
    }

    function signTransaction(uint transactionId) public onlyOwner {
        Transaction storage transaction = transactions[transactionId];
        require(!transaction.executed, "Transaction already executed");
        require(!transaction.signatures[msg.sender], "Transaction already signed");

        transaction.signatures[msg.sender] = true;
        transaction.signatureCount += 1;

        emit TransactionSigned(transactionId, msg.sender);

        if (transaction.signatureCount >= requiredSignatures) {
            executeTransaction(transactionId);
        }
    }

    function executeTransaction(uint transactionId) internal {
        Transaction storage transaction = transactions[transactionId];
        require(transaction.signatureCount >= requiredSignatures, "Not enough signatures");
        require(!transaction.executed, "Transaction already executed");

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}("");
        require(success, "Transaction failed");

        emit TransactionExecuted(transactionId);
    }

    receive() external payable {}
}
