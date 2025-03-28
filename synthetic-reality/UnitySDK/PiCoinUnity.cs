using UnityEngine;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using Nethereum.RPC.Eth.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

public class PiCoinUnity : MonoBehaviour
{
    private Web3 web3;
    private string contractAddress; // Set this in the inspector or through a config
    private string privateKey; // Set this in the inspector or through a config

    public delegate void TransactionStatusHandler(string message);
    public event TransactionStatusHandler OnTransactionStatusChanged;

    private List<string> transactionHistory = new List<string>();

    void Start()
    {
        InitializeWeb3();
    }

    private void InitializeWeb3()
    {
        if (string.IsNullOrEmpty(privateKey) || string.IsNullOrEmpty(contractAddress))
        {
            Debug.LogError("Private key or contract address is not set.");
            return;
        }

        Account account = new Account(privateKey);
        web3 = new Web3(account, "https://YOUR_ETHEREUM_NODE_URL"); // Replace with your Ethereum node URL
    }

    public async void BuyItem(string itemId, decimal price)
    {
        try
        {
            var transactionInput = new TransactionInput
            {
                To = contractAddress,
                Data = "0x" + itemId, // Replace with actual function call data
                Value = Web3.Convert.ToWei(price)
            };

            string transactionHash = await web3.Eth.Transactions.SendTransaction.SendRequestAsync(transactionInput);
            transactionHistory.Add(transactionHash);
            OnTransactionStatusChanged?.Invoke($"Transaction successful: {transactionHash}");
        }
        catch (System.Exception ex)
        {
            OnTransactionStatusChanged?.Invoke($"Transaction failed: {ex.Message}");
        }
    }

    public async void CheckBalance()
    {
        try
        {
            var balance = await web3.Eth.GetBalance.SendRequestAsync(web3.Account.Address);
            Debug.Log($"Balance: {Web3.Convert.FromWei(balance.Value)}");
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Failed to check balance: {ex.Message}");
        }
    }

    public List<string> GetTransactionHistory()
    {
        return transactionHistory;
    }

    public void SetContractAddress(string address)
    {
        contractAddress = address;
    }

    public void SetPrivateKey(string key)
    {
        privateKey = key;
    }
}
