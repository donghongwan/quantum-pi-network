import numpy as np
from qiskit import QuantumCircuit, execute, Aer
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

def generate_bell_state():
    """Generate a Bell state."""
    circuit = QuantumCircuit(2)
    circuit.h(0)  # Apply Hadamard gate to the first qubit
    circuit.cx(0, 1)  # Apply CNOT gate
    return circuit

def teleportation_protocol(initial_state):
    """Simulate the quantum teleportation protocol."""
    # Create a quantum circuit for teleportation
    teleportation_circuit = QuantumCircuit(3, 2)  # 3 qubits, 2 classical bits

    # Prepare the initial state
    if initial_state == '0':
        teleportation_circuit.initialize([1, 0], 0)  # |0>
    elif initial_state == '1':
        teleportation_circuit.initialize([0, 1], 0)  # |1>
    elif initial_state == '+':
        teleportation_circuit.initialize([1/np.sqrt(2), 1/np.sqrt(2)], 0)  # |+>
    elif initial_state == '-':
        teleportation_circuit.initialize([1/np.sqrt(2), -1/np.sqrt(2)], 0)  # |->
    else:
        raise ValueError("Invalid initial state. Choose '0', '1', '+', or '-'.")

    # Generate a Bell state between qubits 1 and 2
    bell_state = generate_bell_state()
    teleportation_circuit.append(bell_state, [1, 2])

    # Apply CNOT and Hadamard gates
    teleportation_circuit.cx(0, 1)
    teleportation_circuit.h(0)

    # Measure qubits 0 and 1
    teleportation_circuit.measure([0, 1], [0, 1])

    # Apply corrections based on measurement results
    teleportation_circuit.cx(1, 2).c_if(0, 1)  # Apply X gate if the first measurement is 1
    teleportation_circuit.cz(0, 2).c_if(1, 1)  # Apply Z gate if the second measurement is 1

    return teleportation_circuit

def simulate_quantum_teleportation(initial_state):
    """Simulate the quantum teleportation process."""
    teleportation_circuit = teleportation_protocol(initial_state)

    # Simulate the quantum circuit
    simulator = Aer.get_backend('qasm_simulator')
    job = execute(teleportation_circuit, simulator, shots=1024)
    result = job.result()
    counts = result.get_counts(teleportation_circuit)

    # Plot the results
    plot_histogram(counts)
    plt.title(f'Teleportation Results for Initial State: {initial_state}')
    plt.show()

    return counts

if __name__ == "__main__":
    # User input for the initial state
    initial_state = input("Enter the initial state (0, 1, +, -): ")
    
    try:
        # Simulate the quantum teleportation process
        counts = simulate_quantum_teleportation(initial_state)
        print("Teleportation Counts:", counts)
    except ValueError as e:
        print(e)
