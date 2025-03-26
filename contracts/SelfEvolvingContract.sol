// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SelfEvolvingContract {
    address public owner;
    string public currentVersion;
    mapping(address => uint256) public votes;
    mapping(string => uint256) public proposalVotes;
    mapping(string => address) public proposalOwners;
    mapping(string => uint256) public proposalCreationTime;
    string[] public proposals;
    uint256 public requiredVotes;
    uint256 public proposalDuration; // Duration for which a proposal is valid

    event ContractUpdated(string newVersion);
    event ProposalCreated(string proposal, address proposer);
    event VoteCasted(address voter, string proposal);
    event ProposalExpired(string proposal);

    constructor(uint256 _requiredVotes, uint256 _proposalDuration) {
        owner = msg.sender;
        currentVersion = "1.0";
        requiredVotes = _requiredVotes; // Set the number of votes required for an update
        proposalDuration = _proposalDuration; // Set the duration for proposals
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier onlyProposer(string memory proposal) {
        require(msg.sender == proposalOwners[proposal], "Not the proposer");
        _;
    }

    modifier proposalExists(string memory proposal) {
        require(proposalVotes[proposal] > 0, "Proposal does not exist");
        _;
    }

    modifier proposalNotExpired(string memory proposal) {
        require(block.timestamp <= proposalCreationTime[proposal] + proposalDuration, "Proposal has expired");
        _;
    }

    function proposeUpdate(string memory newVersion) public {
        require(bytes(newVersion).length > 0, "Version cannot be empty");
        require(proposalVotes[newVersion] == 0, "Proposal already exists");

        proposals.push(newVersion);
        proposalOwners[newVersion] = msg.sender;
        proposalCreationTime[newVersion] = block.timestamp; // Record the time of proposal creation
        emit ProposalCreated(newVersion, msg.sender);
    }

    function voteForUpdate(string memory proposal) public proposalExists(proposal) proposalNotExpired(proposal) {
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
        proposalVotes[proposal] = 0; // Reset votes for the executed proposal
        for (uint256 i = 0; i < proposals.length; i++) {
            if (keccak256(abi.encodePacked(proposals[i])) == keccak256(abi.encodePacked(proposal))) {
                // Reset individual voter votes
                for (uint256 j = 0; j < proposals.length; j++) {
                    votes[msg.sender] = 0; // Reset the voter's vote
                }
                break;
            }
        }
    }

    function expireProposal(string memory proposal) public onlyOwner proposalExists(proposal) {
        require(block.timestamp > proposalCreationTime[proposal] + proposalDuration, "Proposal is still valid");
        emit ProposalExpired(proposal);
        resetVotes(proposal);
    }

    function getProposals() public view returns (string[] memory) {
        return proposals;
    }
}
