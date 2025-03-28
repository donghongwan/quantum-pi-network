# interplanetary_communication.py

import random
import time
import json
import hashlib
from cryptography.fernet import Fernet
import numpy as np

class DataPacket:
    """Class to represent a data packet."""
    def __init__(self, payload, source, destination):
        self.payload = payload
        self.packet_id = self.generate_packet_id()
        self.checksum = self.calculate_checksum()
        self.source = source
        self.destination = destination
        self.timestamp = time.time()
        self.sequence_number = self.generate_sequence_number()

    def generate_packet_id(self):
        """Generates a unique packet ID."""
        return random.randint(1000, 9999)

    def generate_sequence_number(self):
        """Generates a sequence number for packet ordering."""
        return random.randint(1, 1000)

    def calculate_checksum(self):
        """Calculates a checksum for the payload."""
        return hashlib.sha256(self.payload.encode()).hexdigest()

    def to_json(self):
        """Converts the packet to JSON format for transmission."""
        return json.dumps({
            'packet_id': self.packet_id,
            'payload': self.payload,
            'checksum': self.checksum,
            'source': self.source,
            'destination': self.destination,
            'timestamp': self.timestamp,
            'sequence_number': self.sequence_number
        })

    @staticmethod
    def from_json(json_data):
        """Creates a DataPacket from JSON data."""
        data = json.loads(json_data)
        packet = DataPacket(data['payload'], data['source'], data['destination'])
        packet.packet_id = data['packet_id']
        packet.checksum = data['checksum']
        packet.timestamp = data['timestamp']
        packet.sequence_number = data['sequence_number']
        return packet

class InterplanetaryNetwork:
    """Class to simulate an interplanetary communication network."""
    def __init__(self, latency_range=(5, 15)):
        self.latency_range = latency_range  # Latency range in seconds
        self.acknowledged_packets = set()  # Track acknowledged packets

    def send_packet(self, packet):
        """Simulates sending a packet over the network."""
        print(f"Sending packet ID: {packet.packet_id} from {packet.source} to {packet.destination}")
        latency = random.randint(*self.latency_range)
        time.sleep(latency)  # Simulate variable latency
        print(f"Packet sent: {packet.to_json()}")
        return packet.packet_id

    def receive_packet(self, json_data):
        """Simulates receiving a packet and checks for integrity."""
        packet = DataPacket.from_json(json_data)
        if packet.checksum == packet.calculate_checksum():
            print(f"Packet ID: {packet.packet_id} received successfully from {packet.source}.")
            self.acknowledged_packets.add(packet.packet_id)
            return True
        else:
            print(f"Packet ID: {packet.packet_id} corrupted!")
            return False

    def acknowledge_packet(self, packet_id):
        """Acknowledges the receipt of a packet."""
        if packet_id in self.acknowledged_packets:
            print(f"Packet ID: {packet_id} acknowledged.")
            return True
        else:
            print(f"Packet ID: {packet_id} not acknowledged.")
            return False

def encrypt_message(message, key):
    """Encrypts a message using Fernet symmetric encryption."""
    fernet = Fernet(key)
    encrypted_message = fernet.encrypt(message.encode())
    return encrypted_message

def decrypt_message(encrypted_message, key):
    """Decrypts a message using Fernet symmetric encryption."""
    fernet = Fernet(key)
    decrypted_message = fernet.decrypt(encrypted_message).decode()
    return decrypted_message

if __name__ == "__main__":
    # Generate a key for encryption
    key = Fernet.generate_key()
    print(f"Encryption Key: {key.decode()}")

    # Create an interplanetary network with variable latency
    network = InterplanetaryNetwork(latency _range=(5, 15))

    # Create a data packet
    source = "Earth"
    destination = "Mars"
    payload = "Hello from Earth to Mars!"
    packet = DataPacket(payload, source, destination)

    # Encrypt the payload
    encrypted_payload = encrypt_message(packet.payload, key)
    packet.payload = encrypted_payload.decode()  # Store encrypted payload

    # Send the packet
    packet_id = network.send_packet(packet.to_json())

    # Simulate receiving the packet
    received = network.receive_packet(packet.to_json())
    if received:
        print("Data received correctly.")
        # Acknowledge the packet
        network.acknowledge_packet(packet_id)
    else:
        print("Data corruption detected.")

    # Decrypt the payload after receiving
    decrypted_payload = decrypt_message(encrypted_payload.decode(), key)
    print(f"Decrypted Payload: {decrypted_payload}")
