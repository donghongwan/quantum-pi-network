const express = require('express');
const GovernanceService = require('./GovernanceService');

class GovernanceController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/propose', this.createProposal.bind(this));
        this.router.post('/vote', this.voteOnProposal.bind(this));
        this.router.get('/status/:proposalId', this.getProposalStatus.bind(this));
    }

    async createProposal(req, res) {
        const { title, description, proposer } = req.body;
        try {
            const proposal = GovernanceService.createProposal(title, description, proposer);
            res.status(201).json(proposal);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async voteOnProposal(req, res) {
        const { proposalId, voter, vote } = req.body;
        try {
            const proposal = GovernanceService.voteOnProposal(proposalId, voter, vote);
            res.status(200).json(proposal);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProposalStatus(req, res) {
        const { proposalId } = req.params;
        try {
            const proposal = GovernanceService.getProposalStatus(proposalId);
            res.status(200).json(proposal);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new GovernanceController().router;
