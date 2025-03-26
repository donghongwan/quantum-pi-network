// contracts/Governance.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Governance is Ownable {
    using SafeMath for uint256;

    enum ProposalType { Standard, Emergency }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votingEndTime;
        ProposalType proposalType;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public quorum; // Minimum number of votes required
    uint256 public votingPeriod; // Duration for voting in seconds

    event ProposalCreated(uint256 id, string title, ProposalType proposalType);
    event Voted(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 id);

    constructor(uint256 _quorum, uint256 _votingPeriod) {
        quorum = _quorum;
        votingPeriod = _votingPeriod;
    }

    function createProposal(string memory title, string memory description, ProposalType proposalType) external onlyOwner {
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.votingEndTime = block.timestamp.add(votingPeriod);
        newProposal.proposalType = proposalType;

        emit ProposalCreated(proposalCount, title, proposalType);
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.hasVoted[msg.sender], "You have already voted.");
        require(!proposal.executed, "Proposal already executed.");
        require(block.timestamp < proposal.votingEndTime, "Voting period has ended.");

        proposal.hasVoted[msg.sender] = true;

        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed.");
        require(block.timestamp >= proposal.votingEndTime, "Voting period has not ended.");
        require(proposal.votesFor.add(proposal.votesAgainst) >= quorum, "Quorum not reached.");

        proposal.executed = true;

        // Execute the proposal logic here based on proposalType
        if (proposal.votesFor > proposal.votesAgainst) {
            // Logic for approved proposals
        } else {
            // Logic for rejected proposals
        }

        emit ProposalExecuted(proposalId);
    }

    function setQuorum(uint256 newQuorum) external onlyOwner {
        quorum = newQuorum;
    }

    function setVotingPeriod(uint256 newVotingPeriod) external onlyOwner {
        votingPeriod = newVotingPeriod;
    }
}
