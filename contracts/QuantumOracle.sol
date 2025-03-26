// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin's Ownable contract for access control
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QuantumOracle
 * @dev This contract allows users to request data and for authorized parties to fulfill those requests.
 */
contract QuantumOracle is Ownable {
    struct DataRequest {
        address requester;
        string query;
        bool fulfilled;
        string result;
        uint256 timestamp; // Timestamp for request expiration
    }

    mapping(uint256 => DataRequest) public requests;
    uint256 public requestCount;

    // Event declarations
    event DataRequested(uint256 indexed requestId, address indexed requester, string query);
    event DataFulfilled(uint256 indexed requestId, string result);
    event RequestExpired(uint256 indexed requestId);

    // Maximum time (in seconds) a request is valid
    uint256 public constant REQUEST_EXPIRATION_TIME = 1 days;

    /**
     * @dev Request data with a specific query.
     * @param query The query string for the data request.
     */
    function requestData(string memory query) public {
        requestCount++;
        requests[requestCount] = DataRequest(msg.sender, query, false, "", block.timestamp);
        emit DataRequested(requestCount, msg.sender, query);
    }

    /**
     * @dev Fulfill a data request with the result.
     * @param requestId The ID of the request to fulfill.
     * @param result The result of the data request.
     */
    function fulfillData(uint256 requestId, string memory result) public onlyOwner {
        DataRequest storage request = requests[requestId];
        require(!request.fulfilled, "Request already fulfilled");
        require(block.timestamp <= request.timestamp + REQUEST_EXPIRATION_TIME, "Request has expired");

        request.fulfilled = true;
        request.result = result;
        emit DataFulfilled(requestId, result);
    }

    /**
     * @dev Check if a request has expired.
     * @param requestId The ID of the request to check.
     */
    function checkRequestExpiration(uint256 requestId) public {
        DataRequest storage request = requests[requestId];
        require(!request.fulfilled, "Request already fulfilled");
        if (block.timestamp > request.timestamp + REQUEST_EXPIRATION_TIME) {
            emit RequestExpired(requestId);
            delete requests[requestId]; // Optionally delete the expired request
        }
    }

    /**
     * @dev Get the details of a specific request.
     * @param requestId The ID of the request to retrieve.
     * @return The DataRequest struct containing request details.
     */
    function getRequest(uint256 requestId) public view returns (DataRequest memory) {
        return requests[requestId];
    }

    /**
     * @dev Batch fulfill multiple data requests.
     * @param requestIds An array of request IDs to fulfill.
     * @param results An array of results corresponding to the request IDs.
     */
    function fulfillMultipleData(uint256[] memory requestIds, string[] memory results) public onlyOwner {
        require(requestIds.length == results.length, "Mismatched input lengths");
        for (uint256 i = 0; i < requestIds.length; i++) {
            fulfillData(requestIds[i], results[i]);
        }
    }
}
