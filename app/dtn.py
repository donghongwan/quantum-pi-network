import time
import random
import logging
from queue import Queue
from threading import Thread
from flask_socketio import SocketIO

logger = logging.getLogger(__name__)
socketio = SocketIO()

class DTNNode:
    """Represents a node in the Delay-Tolerant Network."""
    
    def __init__(self, node_id):
        self.node_id = node_id
        self.message_queue = Queue()
        self.is_running = True
        self.thread = Thread(target=self.process_messages)
        self.thread.start()

    def send_message(self, message):
        """Send a message to the DTN."""
        logger.info(f"Node {self.node_id} sending message: {message}")
        self.message_queue.put(message)

    def process_messages(self):
        """Process messages in the queue with simulated delays."""
        while self.is_running:
            if not self.message_queue.empty():
                message = self.message_queue.get()
                self.simulate_network_conditions()
                self.deliver_message(message)
            time.sleep(1)  # Simulate processing time

    def simulate_network_conditions(self):
        """Simulate network conditions such as latency and packet loss."""
        latency = random.uniform(0.5, 2.0)  # Simulate latency between 0.5 to 2 seconds
        packet_loss = random.random()  # Randomly determine if the packet is lost

        if packet_loss < 0.1:  # 10% chance of packet loss
            logger.warning(f"Node {self.node_id} experienced packet loss.")
            return  # Simulate packet loss

        logger.info(f"Node {self.node_id} simulating network delay of {latency:.2f} seconds.")
        time.sleep(latency)  # Simulate network latency

    def deliver_message(self, message):
        """Deliver the message to the intended recipient."""
        logger.info(f"Node {self.node_id} delivered message: {message}")
        # Here you would implement the logic to send the message to the recipient
        # For example, you could emit a SocketIO event to notify clients
        socketio.emit('dtn_message', {'node_id': self.node_id, 'message': message})

    def stop(self):
        """Stop the DTN node."""
        self.is_running = False
        self.thread.join()
        logger.info(f"Node {self.node_id} has stopped.")

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    node = DTNNode(node_id="Node1")

    # Simulate sending messages
    for i in range(5):
        node.send_message(f"Transaction {i + 1} from Node1 to Node2")
        time.sleep(1)  # Simulate time between sending messages

    # Stop the node after some time
    time.sleep(10)
    node.stop()
