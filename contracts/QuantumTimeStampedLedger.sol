// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol"; // Import Ownable for access control

contract QuantumTimeStampedLedger is Ownable {
    struct Entry {
        string data;
        uint256 timestamp;
    }

    Entry[] private entries; // Use private visibility for better encapsulation

    event EntryAdded(string indexed data, uint256 indexed timestamp, address indexed addedBy);

    /**
     * @dev Add a new entry to the ledger with a quantum-generated timestamp.
     * @param data The data to be stored in the ledger.
     * @param timestamp The quantum-generated timestamp.
     */
    function addEntry(string memory data, uint256 timestamp) public onlyOwner {
        require(bytes(data).length > 0, "Data cannot be empty");
        require(timestamp > 0, "Timestamp must be greater than zero");

        entries.push(Entry(data, timestamp));
        emit EntryAdded(data, timestamp, msg.sender);
    }

    /**
     * @dev Add multiple entries to the ledger in a single transaction.
     * @param dataArray An array of data to be stored in the ledger.
     * @param timestampArray An array of quantum-generated timestamps.
     */
    function addMultipleEntries(string[] memory dataArray, uint256[] memory timestampArray) public onlyOwner {
        require(dataArray.length == timestampArray.length, "Data and timestamp arrays must have the same length");

        for (uint256 i = 0; i < dataArray.length; i++) {
            addEntry(dataArray[i], timestampArray[i]); // Reuse the addEntry function
        }
    }

    /**
     * @dev Get the number of entries in the ledger.
     * @return The number of entries.
     */
    function getEntryCount() public view returns (uint256) {
        return entries.length;
    }

    /**
     * @dev Get an entry by index.
     * @param index The index of the entry.
     * @return The data and timestamp of the entry.
     */
    function getEntry(uint256 index) public view returns (string memory, uint256) {
        require(index < entries.length, "Entry does not exist");
        Entry memory entry = entries[index];
        return (entry.data, entry.timestamp);
    }

    /**
     * @dev Get all entries in the ledger.
     * @return An array of all entries.
     */
    function getAllEntries() public view returns (Entry[] memory) {
        return entries;
    }
}
