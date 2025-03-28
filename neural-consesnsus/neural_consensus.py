# neural_consensus.py

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Function to generate synthetic data for nodes
def generate_node_data(num_nodes, num_samples):
    """Generates synthetic data for a number of nodes."""
    data = np.random.randint(0, 2, (num_samples, num_nodes))  # Binary votes (0 or 1)
    return data

# Function to create a neural network model
def create_neural_network(input_shape):
    """Creates a more complex feedforward neural network model."""
    model = keras.Sequential([
        layers.Dense(32, activation='relu', input_shape=input_shape),
        layers.Dense(16, activation='relu'),
        layers.Dense(8, activation='relu'),
        layers.Dense(1, activation='sigmoid')  # Output layer for binary classification
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Function to train the model
def train_model(model, data, labels, epochs=100):
    """Trains the neural network model."""
    history = model.fit(data, labels, epochs=epochs, verbose=0)
    return history

# Function to simulate consensus decision using ensemble learning
def simulate_consensus(models, new_data):
    """Simulates the consensus decision based on new data using ensemble learning."""
    predictions = np.array([model.predict(new_data) for model in models])
    # Majority voting
    consensus_decision = np.round(np.mean(predictions, axis=0)).astype(int)
    return consensus_decision

# Function to visualize training history
def plot_training_history(history):
    """Plots the training history of the model."""
    plt.plot(history.history['accuracy'], label='Accuracy')
    plt.title('Model Accuracy')
    plt.ylabel('Accuracy')
    plt.xlabel('Epoch')
    plt.legend()
    plt.show()

if __name__ == "__main__":
    # Parameters
    num_nodes = 5
    num_samples = 1000
    epochs = 100
    num_models = 3  # Number of models in the ensemble

    # Generate synthetic data
    data = generate_node_data(num_nodes, num_samples)
    
    # Create labels (consensus decision) based on majority voting
    labels = np.array([1 if np.sum(votes) > num_nodes / 2 else 0 for votes in data])

    # Create and train multiple neural network models for ensemble learning
    models = []
    for _ in range(num_models):
        model = create_neural_network((num_nodes,))
        history = train_model(model, data, labels, epochs)
        models.append(model)
        plot_training_history(history)

    # Simulate new data for consensus decision
    new_data = generate_node_data(num_nodes, 10)  # Simulate 10 new samples
    consensus_decision = simulate_consensus(models, new_data)

    # Print results
    print("New Data Votes:\n", new_data)
    print("Consensus Decisions:\n", consensus_decision.flatten())
