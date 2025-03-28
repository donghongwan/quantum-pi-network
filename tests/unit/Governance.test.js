// unit/Governance.test.js

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Governance Contract', function () {
    let Governance;
    let governance;
    let owner;
    let addr1;

    beforeEach(async function () {
        Governance = await ethers.getContractFactory('Governance');
        [owner, addr1] = await ethers.getSigners();
        governance = await Governance.deploy();
        await governance.deployed();
    });

    it('Should create a proposal', async function () {
        await governance.createProposal('Increase block reward', 100);
        const proposal = await governance.proposals(0);
        expect(proposal.description).to.equal('Increase block reward');
    });

    it('Should allow voting on a proposal', async function () {
        await governance.createProposal('Increase block reward', 100);
        await governance.connect(addr1).vote(0, true);
        const proposal = await governance.proposals(0);
        expect(proposal.votesFor).to.equal(1);
    });

    it('Should execute a proposal if it passes', async function () {
        await governance.createProposal('Increase block reward', 100);
        await governance.connect(addr1).vote(0, true);
        await governance.executeProposal(0);
        const proposal = await governance.proposals(0);
        expect(proposal.executed).to.be.true;
    });

    // Additional tests can be added here
});
