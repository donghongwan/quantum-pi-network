// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SyntheticBiology {
    struct Experiment {
        address owner;
        uint256 funding;
        string status; // e.g., "Pending", "Funded", "Completed", "Failed"
    }

    mapping(uint256 => Experiment) public experiments;
    uint256 public experimentCount;

    event ExperimentFunded(uint256 indexed experimentId, address indexed funder, uint256 amount);
    event ExperimentStatusUpdated(uint256 indexed experimentId, string status);

    modifier onlyOwner(uint256 experimentId) {
        require(msg.sender == experiments[experimentId].owner, "Not the owner of the experiment");
        _;
    }

    constructor() {
        experimentCount = 0; // Initialize experiment count
    }

    function createExperiment() public returns (uint256) {
        experimentCount++;
        experiments[experimentCount] = Experiment({
            owner: msg.sender,
            funding: 0,
            status: "Pending"
        });
        return experimentCount;
    }

    function fundExperiment(uint256 experimentId) public payable {
        require(msg.value > 0, "Funding amount must be greater than 0");
        require(experimentId > 0 && experimentId <= experimentCount, "Invalid experiment ID");

        experiments[experimentId].funding += msg.value;
        experiments[experimentId].status = "Funded";
        emit ExperimentFunded(experimentId, msg.sender, msg.value);
    }

    function getExperimentStatus(uint256 experimentId) public view returns (string memory) {
        require(experimentId > 0 && experimentId <= experimentCount, "Invalid experiment ID");
        return experiments[experimentId].status;
    }

    function updateExperimentStatus(uint256 experimentId, string memory newStatus) public onlyOwner(experimentId) {
        require(experimentId > 0 && experimentId <= experimentCount, "Invalid experiment ID");
        experiments[experimentId].status = newStatus;
        emit ExperimentStatusUpdated(experimentId, newStatus);
    }

    function withdrawFunds(uint256 experimentId) public onlyOwner(experimentId) {
        require(experimentId > 0 && experimentId <= experimentCount, "Invalid experiment ID");
        uint256 amount = experiments[experimentId].funding;
        require(amount > 0, "No funds to withdraw");

        experiments[experimentId].funding = 0; // Reset funding to prevent re-entrancy
        payable(msg.sender).transfer(amount);
    }
}
