// governance.js

const winston = require('winston'); // For logging

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'governance.log' })
    ]
});

class Proposal {
    constructor(id, description, duration = 86400) { // Default duration is 1 day (in seconds)
        this.id = id;
        this.description = description;
        this.votesFor = 0;
        this.votesAgainst = 0;
        this.voters = new Set();
        this.createdAt = Date.now();
        this.duration = duration; // Duration in seconds
    }

    vote(voter, support) {
        if (this.voters.has(voter)) {
            logger.error(`Voter ${voter} has already voted on proposal ${this.id}`);
            throw new Error('Voter has already voted');
        }
        this.voters.add(voter);
        if (support) {
            this.votesFor++;
        } else {
            this.votesAgainst++;
        }
        logger.info(`Voter ${voter} voted ${support ? 'for' : 'against'} proposal ${this.id}`);
    }

    getResult() {
        return {
            votesFor: this.votesFor,
            votesAgainst: this.votesAgainst,
            passed: this.votesFor > this.votesAgainst,
            expired: this.isExpired()
        };
    }

    isExpired() {
        return (Date.now() - this.createdAt) / 1000 > this.duration;
    }
}

const proposals = {};

// Function to create a new proposal
function createProposal(id, description, duration) {
    if (proposals[id]) {
        logger.error(`Proposal with id ${id} already exists`);
        throw new Error('Proposal already exists');
    }
    const proposal = new Proposal(id, description, duration);
    proposals[id] = proposal;
    logger.info(`Proposal created: ${JSON.stringify(proposal)}`);
    return proposal;
}

// Function to vote on a proposal
function voteOnProposal(id, voter, support) {
    const proposal = proposals[id];
    if (!proposal) {
        logger.error(`Proposal ${id} not found`);
        throw new Error('Proposal not found');
    }
    if (proposal.isExpired()) {
        logger.error(`Proposal ${id} has expired`);
        throw new Error('Proposal has expired');
    }
    proposal.vote(voter, support);
}

// Function to get the result of a proposal
function getProposalResult(id) {
    const proposal = proposals[id];
    if (!proposal) {
        logger.error(`Proposal ${id} not found`);
        throw new Error('Proposal not found');
    }
    return proposal.getResult();
}

module.exports = {
    createProposal,
    voteOnProposal,
    getProposalResult
};
