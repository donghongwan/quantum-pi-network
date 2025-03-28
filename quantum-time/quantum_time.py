# quantum_time.py

from qiskit import QuantumCircuit, Aer, execute
import numpy as np
import matplotlib.pyplot as plt
from qiskit.visualization import plot_bloch_multivector, plot_histogram

# Function to create a time evolution operator
def time_evolution_operator(theta):
    """Creates a time evolution operator for a given angle theta."""
    return np.array([[np.cos(theta / 2), -1j * np.sin(theta / 2)],
                     [-1j * np.sin(theta / 2), np.cos(theta / 2)]])

# Function to create a multi-qubit entangled state
def create_entangled_state(qc, qubits):
    """Creates a Bell state (entangled state) for the given qubits."""
    qc.h(0)  # Apply Hadamard gate to the first qubit
    for i in range(1, qubits):
        qc.cx(0, i)  # Apply CNOT gate to create entanglement

# Function to simulate quantum time manipulation
def simulate_quantum_time(theta, qubits=2, shots=1024):
    """Simulates the quantum time manipulation with entangled qubits."""
    # Create a quantum circuit with the specified number of qubits
    qc = QuantumCircuit(qubits)

    # Create an entangled state
    create_entangled_state(qc, qubits)

    # Apply the time evolution operator to each qubit
    for i in range(qubits):
        U = time_evolution_operator(theta)
        qc.unitary(U, [i], label=f'U(theta) on qubit {i}')

    # Measure all qubits
    qc.measure_all()

    # Use the Aer's qasm_simulator
    simulator = Aer.get_backend('qasm_simulator')

    # Execute the circuit on the qasm simulator
    job = execute(qc, simulator, shots=shots)
    result = job.result()

    # Get the counts
    counts = result.get_counts(qc)
    return counts, qc

# Function to plot the results
def plot_results(counts, qc):
    """Plots the results of the quantum simulation."""
    # Plot histogram of measurement results
    plot_histogram(counts)
    plt.title('Measurement Results')
    plt.show()

    # Get the statevector for Bloch sphere visualization
    statevector_simulator = Aer.get_backend('statevector_simulator')
    statevector_job = execute(qc, statevector_simulator)
    statevector = statevector_job.result().get_statevector()

    # Plot Bloch sphere representation
    plot_bloch_multivector(statevector)
    plt.title('Bloch Sphere Representation')
    plt.show()

if __name__ == "__main__":
    # Define the angle for time evolution (in radians)
    theta = np.pi / 4  # Example: 45 degrees

    # Simulate quantum time manipulation with 2 qubits
    counts, qc = simulate_quantum_time(theta, qubits=2)

    # Print the results
    print("Measurement results:", counts)

    # Plot the results
    plot_results(counts, qc)
