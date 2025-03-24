# src/smart_contract.py

from web3 import Web3
import json

class SmartContract:
    def __init__(self, contract_address, abi, provider_url):
        """
        Initialize the SmartContract instance.

        Parameters:
        - contract_address: str, the address of the deployed smart contract.
        - abi: list, the ABI of the smart contract.
        - provider_url: str, the URL of the Ethereum node provider (e.g., Infura).
        """
        self.web3 = Web3(Web3.HTTPProvider(provider_url))
        self.contract = self.web3.eth.contract(address=contract_address, abi=abi)

    def adjust_supply(self, adjustment_amount, account, private_key):
        """
        Adjust the token supply by calling the smart contract function.

        Parameters:
        - adjustment_amount: int, the amount to adjust the supply (positive or negative).
        - account: str, the Ethereum account address to send the transaction from.
        - private_key: str, the private key of the account.
        """
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
        print(f"Transaction sent: {txn_hash.hex()}")

        # Wait for the transaction to be mined
        txn_receipt = self.web3.eth.waitForTransactionReceipt(txn_hash)
        print(f"Transaction receipt: {txn_receipt}")

def load_contract(abi_path, contract_address, provider_url):
    """
    Load the smart contract from the ABI file and address.

    Parameters:
    - abi_path: str, path to the ABI JSON file.
    - contract_address: str, the address of the deployed smart contract.
    - provider_url: str, the URL of the Ethereum node provider.

    Returns:
    - SmartContract instance.
    """
    with open(abi_path) as f:
        abi = json.load(f)
    return SmartContract(contract_address, abi, provider_url)
