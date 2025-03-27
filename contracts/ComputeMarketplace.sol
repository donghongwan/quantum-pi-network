// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Import ERC20 interface
import "@openzeppelin/contracts/access/Ownable.sol"; // Import Ownable for access control

contract ComputeMarketplace is Ownable {
    IERC20 public piCoin; // Reference to the Pi Coin token contract

    struct Service {
        address provider;
        string description;
        uint256 price; // Price in Pi Coin
        bool isActive;
        uint256 expiration; // Expiration timestamp
    }

    mapping(uint256 => Service) public services; // Mapping of service ID to Service
    uint256 public serviceCount; // Counter for service IDs

    event ServiceListed(uint256 serviceId, address indexed provider, string description, uint256 price, uint256 expiration);
    event ServicePurchased(uint256 serviceId, address indexed buyer);
    event ServiceDeactivated(uint256 serviceId, address indexed provider);

    constructor(address _piCoinAddress) {
        piCoin = IERC20(_piCoinAddress); // Initialize the Pi Coin token contract
    }

    function listService(string memory description, uint256 price, uint256 duration) public {
        require(price > 0, "Price must be greater than zero");
        require(duration > 0, "Duration must be greater than zero");

        serviceCount++;
        uint256 expiration = block.timestamp + duration; // Set expiration time
        services[serviceCount] = Service(msg.sender, description, price, true, expiration);
        
        emit ServiceListed(serviceCount, msg.sender, description, price, expiration);
    }

    function purchaseService(uint256 serviceId) public {
        Service storage service = services[serviceId];
        require(service.isActive, "Service is not active");
        require(block.timestamp < service.expiration, "Service has expired");
        require(piCoin.transferFrom(msg.sender, service.provider, service.price), "Payment failed");

        emit ServicePurchased(serviceId, msg.sender);
    }

    function deactivateService(uint256 serviceId) public {
        Service storage service = services[serviceId];
        require(msg.sender == service.provider, "Only the provider can deactivate the service");
        service.isActive = false;

        emit ServiceDeactivated(serviceId, msg.sender);
    }

    function getServiceDetails(uint256 serviceId) public view returns (Service memory) {
        return services[serviceId];
    }
}
