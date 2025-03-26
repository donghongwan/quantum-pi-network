// contracts/Identity.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Identity is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct User {
        string name;
        string email;
        bool exists;
        bool verified;
    }

    mapping(address => User) private users;

    event UserRegistered(address indexed userAddress, string name, string email);
    event UserVerified(address indexed userAddress);

    constructor() {
        _setupRole(ADMIN_ROLE, msg.sender); // Grant admin role to contract deployer
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    function registerUser (string memory _name, string memory _email) public {
        require(!users[msg.sender].exists, "User  already registered");
        
        users[msg.sender] = User({
            name: _name,
            email: _email,
            exists: true,
            verified: false
        });

        emit UserRegistered(msg.sender, _name, _email);
    }

    function verifyUser (address _userAddress) public onlyAdmin {
        require(users[_userAddress].exists, "User  does not exist");
        users[_userAddress].verified = true;
        emit UserVerified(_userAddress);
    }

    function getUser (address _userAddress) public view returns (string memory, string memory, bool) {
        require(users[_userAddress].exists, "User  does not exist");
        User memory user = users[_userAddress];
        return (user.name, user.email, user.verified);
    }
}
