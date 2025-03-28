import requests
import logging
import os

class SequencerInterface:
    """Class to interface with DNA sequencers."""

    def __init__(self, sequencer_url):
        self.sequencer_url = sequencer_url
        self.logger = self.setup_logging()

    def setup_logging(self):
        """Set up logging for the sequencer interface."""
        logger = logging.getLogger("SequencerInterface")
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def start_sequencing(self, experiment_id, sample_data):
        """Start the sequencing process for a given experiment."""
        payload = {
            "experiment_id": experiment_id,
            "sample_data": sample_data
        }
        try:
            response = requests.post(f"{self.sequencer_url}/start", json=payload)
            response.raise_for_status()  # Raise an error for bad responses
            self.logger.info("Sequencing started for experiment %s", experiment_id)
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error("Failed to start sequencing: %s", str(e))
            return {"error": "Failed to start sequencing"}

    def get_results(self, experiment_id):
        """Get the sequencing results for a given experiment."""
        try:
            response = requests.get(f"{self.sequencer_url}/results/{experiment_id}")
            response.raise_for_status()  # Raise an error for bad responses
            self.logger.info("Retrieved results for experiment %s", experiment_id)
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error("Failed to retrieve results: %s", str(e))
            return {"error": "Failed to retrieve results"}

    def check_status(self, experiment_id):
        """Check the status of a sequencing experiment."""
        try:
            response = requests.get(f"{self.sequencer_url}/status/{experiment_id}")
            response.raise_for_status()  # Raise an error for bad responses
            self.logger.info("Checked status for experiment %s", experiment_id)
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error("Failed to check status: %s", str(e))
            return {"error": "Failed to check status"}

# Example usage
if __name__ == "__main__":
    sequencer_url = os.getenv("SEQUENCER_URL", "http://localhost:5000")  # Default to localhost
    sequencer = SequencerInterface(sequencer_url)

    # Start a sequencing experiment
    experiment_id = 1
    sample_data = {"DNA_sequence": "ATCGTAGCTAGCTAGCTAGC"}
    start_response = sequencer.start_sequencing(experiment_id, sample_data)
    print(start_response)

    # Check the status of the experiment
    status_response = sequencer.check_status(experiment_id)
    print(status_response)

    # Retrieve results of the experiment
    results_response = sequencer.get_results(experiment_id)
    print(results_response)
