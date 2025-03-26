// contracts/CrossChain.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrossChain {
    event CrossChainMessage(address indexed from, string message, uint256 targetChainId, uint256 messageId);
    
    struct Message {
        address sender;
        string message;
        uint256 targetChainId;
        bool exists;
    }

    mapping(uint256 => Message) public messages;
    uint256 public messageCount;

    function sendMessage(string memory _message, uint256 _targetChainId) public {
        messageCount++;
        messages[messageCount] = Message({
            sender: msg.sender,
            message: _message,
            targetChainId: _targetChainId,
            exists: true
        });

        emit CrossChainMessage(msg.sender, _message, _targetChainId, messageCount);
    }

    function getMessage(uint256 _messageId) public view returns (address, string memory, uint256) {
        require(messages[_messageId].exists, "Message does not exist");
        Message memory msgData = messages[_messageId];
        return (msgData.sender, msgData.message, msgData.targetChainId);
    }
}
