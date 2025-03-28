import logging
import numpy as np
import matplotlib.pyplot as plt

class QuantumSimulation:
    """Simulates quantum behaviors and interactions in the Quantum-Pi Network."""

    def __init__(self, num_qubits):
        self.num_qubits = num_qubits
        self.states = self.initialize_states()

    def initialize_states(self):
        """Initialize quantum states for the given number of qubits."""
        # Each qubit starts in the |0⟩ state
        return np.zeros((2**self.num_qubits, 1))

    def apply_hadamard(self, qubit_index):
        """Apply the Hadamard gate to a specific qubit."""
        H = 1/np.sqrt(2) * np.array([[1, 1], [1, -1]])
        self.apply_gate(H, qubit_index)

    def apply_pauli_x(self, qubit_index):
        """Apply the Pauli-X gate (NOT gate) to a specific qubit."""
        X = np.array([[0, 1], [1, 0]])
        self.apply_gate(X, qubit_index)

    def apply_cnot(self, control_index, target_index):
        """Apply the CNOT gate with the specified control and target qubits."""
        CNOT = np.eye(1)
        for i in range(self.num_qubits):
            if i == control_index:
                CNOT = np.kron(CNOT, np.array([[1, 0], [0, 1]]))  # Control qubit
            elif i == target_index:
                CNOT = np.kron(CNOT, np.array([[1, 0], [0, 1]]))  # Target qubit
            else:
                CNOT = np.kron(CNOT, np.eye(2))  # Other qubits
        self.apply_gate(CNOT, control_index)

    def apply_gate(self, gate, qubit_index):
        """Apply a quantum gate to the specified qubit."""
        # Create the full gate for the multi-qubit system
        full_gate = np.eye(1)
        for i in range(self.num_qubits):
            if i == qubit_index:
                full_gate = np.kron(full_gate, gate)
            else:
                full_gate = np.kron(full_gate, np.eye(2))
        
        # Apply the gate to the current state
        self.states = np.dot(full_gate, self.states)

    def measure(self):
        """Measure the quantum state and return the result."""
        probabilities = np.abs(self.states)**2
        result = np.random.choice(range(2**self.num_qubits), p=probabilities.flatten())
        logging.info(f"Measurement result: {result}")
        return result

    def create_entangled_state(self):
        """Create a Bell state (entangled state) between two qubits."""
        self.initialize_states()
        self.apply_hadamard(0)  # Apply Hadamard to the first qubit
        self.apply_cnot(0, 1)    # Apply CNOT with the first qubit as control and second as target
        logging.info("Entangled state created.")

    def simulate_quantum_algorithm(self, algorithm):
        """Simulate a specified quantum algorithm."""
        if algorithm == "quantum_teleportation":
            self.simulate_quantum_teleportation()
        elif algorithm == "grovers_search":
            self.simulate_grovers_search()
        else:
            logging.error("Unknown quantum algorithm specified.")

    def simulate_quantum_teleportation(self):
        """Simulate a simple quantum teleportation protocol."""
        logging.info("Starting quantum teleportation simulation...")
        self.create_entangled_state()  # Create entangled state
        # Simulate teleportation logic here (omitted for brevity)
        result = self.measure()
        logging.info(f"Teleportation result: {result}")

    def simulate_grovers_search(self):
        """Simulate Grover's Search algorithm."""
        logging.info("Starting Grover's Search simulation...")
        # Implement Grover's Search logic here (omitted for brevity)
        result = self.measure()
        logging.info(f"Grover's Search result: {result}")

    def visualize_state(self):
        """Visualize the quantum state."""
        plt.figure(figsize=(10, 5))
        plt.bar(range(len(self.states)), np.abs(self.states.flatten())**2)
        plt.title('Quantum State Probability Distribution')
        plt.xlabel('State Index')
        plt.ylabel('Probability')
        plt.grid()
        plt.show()

    def __str__(self):
        return f"QuantumSimulation with {self.num_qubits} qubits."

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    # Initialize quantum simulation with 2 qubits
    quantum_simulation = QuantumSimulation(num_qubits=2)

    # Simulate quantum teleportation
    quantum_simulation.simulate_quantum_algorithm("quantum_teleportation")

    # Simulate Grover's Search
    quantum_simulation.simulate_quantum_algorithm("grovers_search")

    # Visualize the quantum state
    quantum_simulation.visualize_state()
