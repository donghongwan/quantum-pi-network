// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DigitalConsciousness {
    struct UserConsciousness {
        bytes encryptedData; // Encrypted digital blueprint
        bool exists; // Check if user data exists
        uint256 expiration; // Expiration timestamp
    }

    mapping(address => UserConsciousness) private consciousnessData;

    event ConsciousnessStored(address indexed user, bytes encryptedData, uint256 expiration);
    event ConsciousnessUpdated(address indexed user, bytes encryptedData, uint256 expiration);
    event ConsciousnessRetrieved(address indexed user, bytes encryptedData);
    event ConsciousnessDeleted(address indexed user);

    modifier onlyExistingData() {
        require(consciousnessData[msg.sender].exists, "No data found for this user");
        _;
    }

    modifier onlyActiveData() {
        require(consciousnessData[msg.sender].exists, "No data found for this user");
        require(block.timestamp < consciousnessData[msg.sender].expiration, "Data has expired");
        _;
    }

    function storeConsciousness(bytes memory encryptedData, uint256 duration) public {
        require(!consciousnessData[msg.sender].exists, "Data already exists for this user");
        require(duration > 0, "Duration must be greater than zero");

        uint256 expiration = block.timestamp + duration;
        consciousnessData[msg.sender] = UserConsciousness(encryptedData, true, expiration);
        emit ConsciousnessStored(msg.sender, encryptedData, expiration);
    }

    function updateConsciousness(bytes memory encryptedData, uint256 duration) public onlyExistingData {
        uint256 expiration = block.timestamp + duration;
        consciousnessData[msg.sender].encryptedData = encryptedData;
        consciousnessData[msg.sender].expiration = expiration;
        emit ConsciousnessUpdated(msg.sender, encryptedData, expiration);
    }

    function retrieveConsciousness() public view onlyActiveData returns (bytes memory) {
        emit ConsciousnessRetrieved(msg.sender, consciousnessData[msg.sender].encryptedData);
        return consciousnessData[msg.sender].encryptedData;
    }

    function deleteConsciousness() public onlyExistingData {
        delete consciousnessData[msg.sender];
        emit ConsciousnessDeleted(msg.sender);
    }
}
