# src/smart_contract.py

from web3 import Web3
import json
import logging
from typing import Any, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SmartContract:
    def __init__(self, contract_address: str, abi: Dict[str, Any], provider_url: str):
        """
        Initialize the SmartContract instance.

        Parameters:
        - contract_address: str, the address of the deployed smart contract.
        - abi: list, the ABI of the smart contract.
        - provider_url: str, the URL of the Ethereum node provider (e.g., Infura).
        """
        self.web3 = Web3(Web3.HTTPProvider(provider_url))
        if not self.web3.isConnected():
            logger.error("Failed to connect to the Ethereum provider.")
            raise ConnectionError("Failed to connect to the Ethereum provider.")
        
        self.contract = self.web3.eth.contract(address=contract_address, abi=abi)
        logger.info("Smart contract initialized successfully.")

    def adjust_supply(self, adjustment_amount: int, account: str, private_key: str) -> str:
        """
        Adjust the token supply by calling the smart contract function.

        Parameters:
        - adjustment_amount: int, the amount to adjust the supply (positive or negative).
        - account: str, the Ethereum account address to send the transaction from.
        - private_key: str, the private key of the account.

        Returns:
        - txn_hash: str, the transaction hash.
        """
        try:
            # Build the transaction
            nonce = self.web3.eth.getTransactionCount(account)
            transaction = self.contract.functions.adjustSupply(adjustment_amount).buildTransaction({
                'chainId': 1,  # Mainnet chain ID; change to 3 for Ropsten, etc.
                'gas': 2000000,
                'gasPrice': self.web3.toWei('50', 'gwei'),
                'nonce': nonce,
            })

            # Sign the transaction
            signed_txn = self.web3.eth.account.signTransaction(transaction, private_key)

            # Send the transaction
            txn_hash = self.web3.eth.sendRawTransaction(signed_txn.rawTransaction)
            logger.info(f"Transaction sent: {txn_hash.hex()}")

            # Wait for the transaction to be mined
            txn_receipt = self.web3.eth.waitForTransactionReceipt(txn_hash)
            logger.info(f"Transaction receipt: {txn_receipt}")
            return txn_hash.hex()
        except Exception as e:
            logger.error(f"Error adjusting supply: {e}")
            raise

    def call_function(self, function_name: str, *args: Any) -> Any:
        """
        Call a read-only function of the smart contract.

        Parameters:
        - function_name: str, the name of the function to call.
        - args: Any, the arguments to pass to the function.

        Returns:
        - result: Any, the result of the function call.
        """
        try:
            result = getattr(self.contract.functions, function_name)(*args).call()
            logger.info(f"Function '{function_name}' called successfully with result: {result}")
            return result
        except Exception as e:
            logger.error(f"Error calling function '{function_name}': {e}")
            raise

def load_contract(abi_path: str, contract_address: str, provider_url: str) -> SmartContract:
    """
    Load the smart contract from the ABI file and address.

    Parameters:
    - abi_path: str, path to the ABI JSON file.
    - contract_address: str, the address of the deployed smart contract.
    - provider_url: str, the URL of the Ethereum node provider.

    Returns:
    - SmartContract instance.
    """
    try:
        with open(abi_path) as f:
            abi = json.load(f)
        logger.info("ABI loaded successfully.")
        return SmartContract(contract_address, abi, provider_url)
    except FileNotFoundError:
        logger.error(f"ABI file {abi_path} not found.")
        raise
    except json.JSONDecodeError:
        logger.error(f"Error decoding JSON from ABI file {abi_path}.")
        raise
