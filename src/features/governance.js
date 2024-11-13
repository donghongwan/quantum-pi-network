// governance.js

class Proposal {
    constructor(id, description) {
        this.id = id;
        this.description = description;
        this.votesFor = 0;
        this.votesAgainst = 0;
        this.voters = new Set();
    }

    vote(voter, support) {
        if (this.voters.has(voter)) {
            throw new Error('Voter has already voted');
        }
        this.voters.add(voter);
        if (support) {
            this.votesFor++;
        } else {
            this.votesAgainst++;
        }
    }

    getResult() {
        return {
            votesFor: this.votesFor,
            votesAgainst: this.votesAgainst,
            passed: this.votesFor > this.votesAgainst
        };
    }
}

const proposals = {};

// Function to create a new proposal
function createProposal(id, description) {
    const proposal = new Proposal(id, description);
    proposals[id] = proposal;
    return proposal;
}

// Function to vote on a proposal
function voteOnProposal(id, voter, support) {
    const proposal = proposals[id];
    if (!proposal) {
        thrownew Error('Proposal not found');
    }
    proposal.vote(voter, support);
}

// Function to get the result of a proposal
function getProposalResult(id) {
    const proposal = proposals[id];
    if (!proposal) {
        throw new Error('Proposal not found');
    }
    return proposal.getResult();
}

module.exports = {
    createProposal,
    voteOnProposal,
    getProposalResult
};
