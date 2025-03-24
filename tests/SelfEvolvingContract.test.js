const SelfEvolvingContract = artifacts.require("SelfEvolvingContract");

contract("SelfEvolvingContract", (accounts) => {
    let contract;
    const [owner, proposer1, proposer2, voter1, voter2] = accounts;
    const requiredVotes = 3;

    beforeEach(async () => {
        contract = await SelfEvolvingContract.new(requiredVotes);
    });

    it("should allow the owner to propose an update", async () => {
        await contract.proposeUpdate("1.1", { from: proposer1 });
        const proposals = await contract.getProposals();
        assert.equal(proposals.length, 1, "Proposal was not added");
        assert.equal(proposals[0], "1.1", "Proposal does not match");
    });

    it("should not allow empty proposals", async () => {
        try {
            await contract.proposeUpdate("", { from: proposer1 });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("Version cannot be empty"), "Error message does not match");
        }
    });

    it("should allow users to vote for a proposal", async () => {
        await contract.proposeUpdate("1.1", { from: proposer1 });
        await contract.voteForUpdate("1.1", { from: voter1 });
        const votes = await contract.proposalVotes("1.1");
        assert.equal(votes.toString(), "1", "Vote count should be 1");
    });

    it("should not allow the same user to vote multiple times", async () => {
        await contract.proposeUpdate("1.1", { from: proposer1 });
        await contract.voteForUpdate("1.1", { from: voter1 });
        try {
            await contract.voteForUpdate("1.1", { from: voter1 });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("You have already voted"), "Error message does not match");
        }
    });

    it("should execute the proposal when enough votes are received", async () => {
        await contract.proposeUpdate("1.1", { from: proposer1 });
        await contract.voteForUpdate("1.1", { from: voter1 });
        await contract.voteForUpdate("1.1", { from: voter2 });
        await contract.voteForUpdate("1.1", { from: proposer2 }); // This should trigger execution

        const currentVersion = await contract.currentVersion();
        assert.equal(currentVersion, "1.1", "Version was not updated");
    });

    it("should reset votes after execution", async () => {
        await contract.proposeUpdate("1.1", { from: proposer1 });
        await contract.voteForUpdate("1.1", { from: voter1 });
        await contract.voteForUpdate("1.1", { from: voter2 });
        await contract.voteForUpdate("1.1", { from: proposer2 });

        const votesBefore = await contract.proposalVotes("1.1");
        assert.equal(votesBefore.toString(), "3", "Vote count should be 3");

        await contract.executeUpdate("1.1", { from: proposer1 });

        const votesAfter = await contract.proposalVotes("1.1");
        assert.equal(votesAfter.toString(), "0", "Vote count should be reset to 0");
    });

    it("should not allow non-proposers to execute the proposal", async () => {
        await contract.proposeUpdate("1.1", { from: proposer1 });
        await contract.voteForUpdate("1.1", { from: voter1 });
        await contract.voteForUpdate("1.1", { from: voter2 });
        await contract.voteForUpdate("1.1", { from: proposer2 });

        try {
            await contract.executeUpdate("1.1", { from: voter1 });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("Not the proposer"), "Error message does not match");
        }
    });
});
