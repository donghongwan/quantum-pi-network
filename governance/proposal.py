import uuid
from datetime import datetime

class GovernanceProposal:
    """Class to represent a governance proposal."""

    def __init__(self, proposer, description, options):
        self.proposal_id = str(uuid.uuid4())  # Unique identifier for the proposal
        self.proposer = proposer
        self.description = description
        self.options = options  # List of options for voting
        self.votes = {option: 0 for option in options}  # Initialize votes for each option
        self.status = "Pending"  # Status of the proposal (Pending, Active, Completed, Failed)
        self.simulation_results = None
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def vote(self, option, weight=1):
        """Cast a vote for a specific option with an optional weight."""
        if option in self.votes:
            self.votes[option] += weight
            self.updated_at = datetime.now()  # Update the timestamp
        else:
            raise ValueError("Invalid voting option.")

    def simulate(self, quantum_simulation):
        """Run a quantum simulation for the proposal."""
        self.simulation_results = quantum_simulation.run_simulation(self)
        self.status = "Simulated"  # Update status after simulation
        self.updated_at = datetime.now()  # Update the timestamp

    def finalize(self):
        """Finalize the proposal based on voting results."""
        if self.status == "Active":
            winning_option = max(self.votes, key=self.votes.get)
            self.status = "Completed"
            return winning_option
        else:
            raise Exception("Proposal must be active to finalize.")

    def get_summary(self):
        """Get a summary of the proposal."""
        return {
            "proposal_id": self.proposal_id,
            "proposer": self.proposer,
            "description": self.description,
            "options": self.options,
            "votes": self.votes,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "simulation_results": self.simulation_results,
        }
