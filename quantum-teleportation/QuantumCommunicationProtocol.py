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

def quantum_key_distribution(num_keys):
    """Simulate a quantum key distribution protocol using Bell states."""
    keys = []
    for _ in range(num_keys):
        # Generate a Bell state
        bell_state = generate_bell_state()
        
        # Measure the qubits
        bell_state.measure_all()
        
        # Simulate the quantum circuit
        simulator = Aer.get_backend('qasm_simulator')
        job = execute(bell_state, simulator, shots=1)
        result = job.result()
        counts = result.get_counts()
        
        # Extract the key from the measurement result
        key = list(counts.keys())[0]  # Get the most frequent measurement result
        keys.append(key)
    
    return keys

def analyze_security(keys):
    """Analyze the security of the generated keys."""
    unique_keys = set(keys)
    print(f"Generated Keys: {keys}")
    print(f"Unique Keys: {unique_keys}")
    print(f"Key Length: {len(keys)}")
    print(f"Unique Key Length: {len(unique_keys)}")
    
    if len(unique_keys) < len(keys) / 2:
        print("Warning: Potential eavesdropping detected!")
    else:
        print("Keys are secure.")

def visualize_keys(keys):
    """Visualize the distribution of generated keys."""
    key_counts = {key: keys.count(key) for key in set(keys)}
    plot_histogram(key_counts)
    plt.title("Distribution of Generated Keys")
    plt.xlabel("Keys")
    plt.ylabel("Counts")
    plt.show()

if __name__ == "__main__":
    # User input for the number of keys to generate
    try:
        num_keys = int(input("Enter the number of keys to generate: "))
        if num_keys <= 0:
            raise ValueError("Number of keys must be a positive integer.")
        
        # Simulate the quantum key distribution process
        keys = quantum_key_distribution(num_keys)
        
        # Analyze the security of the generated keys
        analyze_security(keys)
        
        # Visualize the distribution of generated keys
        visualize_keys(keys)
        
    except ValueError as e:
        print(f"Error: {e}")
