// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuantumOracle {
    struct DataRequest {
        address requester;
        string query;
        bool fulfilled;
        string result;
    }

    mapping(uint256 => DataRequest) public requests;
    uint256 public requestCount;

    event DataRequested(uint256 indexed requestId, address indexed requester, string query);
    event DataFulfilled(uint256 indexed requestId, string result);

    function requestData(string memory query) public {
        requestCount++;
        requests[requestCount] = DataRequest(msg.sender, query, false, "");
        emit DataRequested(requestCount, msg.sender, query);
    }

    function fulfillData(uint256 requestId, string memory result) public {
        DataRequest storage request = requests[requestId];
        require(!request.fulfilled, "Request already fulfilled");
        request.fulfilled = true;
        request.result = result;
        emit DataFulfilled(requestId, result);
    }

    function getRequest(uint256 requestId) public view returns (DataRequest memory) {
        return requests[requestId];
    }
}
