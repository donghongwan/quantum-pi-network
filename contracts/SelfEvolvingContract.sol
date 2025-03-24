// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SelfEvolvingContract {
    address public owner;
    string public currentVersion;
    mapping(address => uint256) public votes;
    mapping(string => uint256) public proposalVotes;
    mapping(string => address) public proposalOwners;
    string[] public proposals;
    uint256 public requiredVotes;

    event ContractUpdated(string newVersion);
    event ProposalCreated(string proposal, address proposer);
    event VoteCasted(address voter, string proposal);

    constructor(uint256 _requiredVotes) {
        owner = msg.sender;
        currentVersion = "1.0";
        requiredVotes = _requiredVotes; // Set the number of votes required for an update
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier onlyProposer(string memory proposal) {
        require(msg.sender == proposalOwners[proposal], "Not the proposer");
        _;
    }

    function proposeUpdate(string memory newVersion) public {
        require(bytes(newVersion).length > 0, "Version cannot be empty");
        require(proposalVotes[newVersion] == 0, "Proposal already exists");

        proposals.push(newVersion);
        proposalOwners[newVersion] = msg.sender;
        emit ProposalCreated(newVersion, msg.sender);
    }

    function voteForUpdate(string memory proposal) public {
        require(proposalVotes[proposal] > 0 || bytes(proposal).length > 0, "Proposal does not exist");
        require(votes[msg.sender] < 1, "You have already voted");

        votes[msg.sender] += 1; // Mark voter
        proposalVotes[proposal] += 1; // Increment vote count for the proposal
        emit VoteCasted(msg.sender, proposal);

        // Check if the proposal has enough votes to execute
        if (proposalVotes[proposal] >= requiredVotes) {
            executeUpdate(proposal);
        }
    }

    function executeUpdate(string memory newVersion) internal onlyProposer(newVersion) {
        currentVersion = newVersion;
        emit ContractUpdated(newVersion);
        resetVotes(newVersion); // Reset votes after execution
    }

    function resetVotes(string memory proposal) internal {
        for (uint256 i = 0; i < proposals.length; i++) {
            if (keccak256(abi.encodePacked(proposals[i])) == keccak256(abi.encodePacked(proposal))) {
                proposalVotes[proposal] = 0; // Reset votes for the executed proposal
                break;
            }
        }
        // Reset individual voter votes
        for (uint256 i = 0; i < proposals.length; i++) {
            votes[msg.sender] = 0; // Reset the voter's vote
        }
    }

    function getProposals() public view returns (string[] memory) {
        return proposals;
    }
}
