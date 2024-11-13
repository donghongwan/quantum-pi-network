class GovernanceService {
    constructor() {
        this.proposals = new Map(); // In-memory storage for proposals
        this.votes = new Map(); // In-memory storage for votes
    }

    createProposal(title, description, proposer) {
        const proposalId = this.generateProposalId(title, proposer);
        const proposal = {
            id: proposalId,
            title,
            description,
            proposer,
            votes: { yes: 0, no: 0 },
            status: 'pending',
            createdAt: new Date(),
        };

        this.proposals.set(proposalId, proposal);
        return proposal;
    }

    voteOnProposal(proposalId, voter, vote) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal) {
            throw new Error('Proposal not found');
        }

        if (this.votes.has(`${proposalId}-${voter}`)) {
            throw new Error('Voter has already voted on this proposal');
        }

        if (vote === 'yes') {
            proposal.votes.yes += 1;
        } else if (vote === 'no') {
            proposal.votes.no += 1;
        } else {
            throw new Error('Invalid vote');
        }

        this.votes.set(`${proposalId}-${voter}`, vote);
        return proposal;
    }

    getProposalStatus(proposalId) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal) {
            throw new Error('Proposal not found');
        }
        return proposal;
    }

    generateProposalId(title, proposer) {
        return `${title}-${proposer}-${Date.now()}`; // Simple ID generation
    }
}

module.exports = new GovernanceService();
