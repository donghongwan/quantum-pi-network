using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class PiCoinManager : MonoBehaviour
{
    private PiCoinUnity piCoinUnity;

    // UI Elements
    public Text balanceText;
    public Text transactionStatusText;
    public InputField itemIdInput;
    public InputField priceInput;

    void Start()
    {
        piCoinUnity = gameObject.AddComponent<PiCoinUnity>();
        piCoinUnity.OnTransactionStatusChanged += HandleTransactionStatus;
        piCoinUnity.SetContractAddress("YOUR_CONTRACT_ADDRESS"); // Set this dynamically if needed
        piCoinUnity.SetPrivateKey("YOUR_PRIVATE_KEY"); // Set this securely
        UpdateBalance();
    }

    public void PurchaseItem()
    {
        string itemId = itemIdInput.text;
        if (decimal.TryParse(priceInput.text, out decimal price))
        {
            piCoinUnity.BuyItem(itemId, price);
        }
        else
        {
            Debug.LogError("Invalid price input.");
            transactionStatusText.text = "Invalid price input.";
        }
    }

    private void HandleTransactionStatus(string message)
    {
        Debug.Log(message);
        transactionStatusText.text = message;
        UpdateBalance(); // Update balance after transaction
    }

    public void UpdateBalance()
    {
        piCoinUnity.CheckBalance();
    }

    public void DisplayBalance(decimal balance)
    {
        balanceText.text = $"Balance: {balance} Pi Coins";
    }

    public void SetContractAddress(string address)
    {
        piCoinUnity.SetContractAddress(address);
    }

    public void SetPrivateKey(string key)
    {
        piCoinUnity.SetPrivateKey(key);
    }

    private void OnEnable()
    {
        piCoinUnity.OnTransactionStatusChanged += HandleTransactionStatus;
    }

    private void OnDisable()
    {
        piCoinUnity.OnTransactionStatusChanged -= HandleTransactionStatus;
    }
}
