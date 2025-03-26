// contracts/Migrations.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Migrations is Ownable {
    uint256 public last_completed_migration;

    event MigrationCompleted(uint256 indexed completedMigration);

    modifier restricted() {
        require(msg.sender == owner(), "Only the contract owner can call this function");
        _;
    }

    function setCompleted(uint256 completed) public restricted {
        last_completed_migration = completed;
        emit MigrationCompleted(completed);
    }

    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
