// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CosmicIdentityVerification is Ownable, AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Identity {
        string[] cosmicFingerprints; // Array of unique cosmic fingerprints
        bool isVerified; // Verification status
        uint256 registrationTimestamp; // Timestamp of registration
    }

    mapping(address => Identity) public identities;

    event IdentityRegistered(address indexed user, string cosmicFingerprint);
    event IdentityVerified(address indexed user);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(VERIFIER_ROLE, msg.sender); // Grant the deployer the verifier role
    }

    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Caller is not a verifier");
        _;
    }

    function registerIdentity(string memory cosmicFingerprint) external {
        require(bytes(cosmicFingerprint).length > 0, "Cosmic fingerprint cannot be empty");
        require(!identities[msg.sender].isVerified, "Identity already registered");

        identities[msg.sender].cosmicFingerprints.push(cosmicFingerprint);
        identities[msg.sender].registrationTimestamp = block.timestamp;

        emit IdentityRegistered(msg.sender, cosmicFingerprint);
    }

    function verifyIdentity(address user) external onlyVerifier {
        require(!identities[user].isVerified, "Identity already verified");
        identities[user].isVerified = true;

        emit IdentityVerified(user);
    }

    function getIdentity(address user) external view returns (string[] memory, bool, uint256) {
        return (identities[user].cosmicFingerprints, identities[user].isVerified, identities[user].registrationTimestamp);
    }

    function addCosmicFingerprint(string memory cosmicFingerprint) external {
        require(identities[msg.sender].isVerified, "Identity not verified");
        require(bytes(cosmicFingerprint).length > 0, "Cosmic fingerprint cannot be empty");

        identities[msg.sender].cosmicFingerprints.push(cosmicFingerprint);
        emit IdentityRegistered(msg.sender, cosmicFingerprint);
    }
}
