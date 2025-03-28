#include "PiCoinManager.h"
#include "Nethereum.h" // Include the Nethereum header for Ethereum interactions
#include "Json.h"
#include "JsonUtilities.h"

// Sets default values
APiCoinManager::APiCoinManager()
{
    PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void APiCoinManager::BeginPlay()
{
    Super::BeginPlay();
    InitializeWeb3();
}

void APiCoinManager::InitializeWeb3()
{
    // Initialize the Web3 instance with the Ethereum node URL and private key
    FString EthereumNodeURL = TEXT("https://YOUR_ETHEREUM_NODE_URL"); // Replace with your Ethereum node URL
    FString PrivateKey = TEXT("YOUR_PRIVATE_KEY"); // Replace with your wallet's private key

    // Create a new Web3 instance
    Web3 = NewObject<UWeb3>(UWeb3::StaticClass());
    if (Web3)
    {
        Web3->Initialize(EthereumNodeURL, PrivateKey);
        UE_LOG(LogTemp, Log, TEXT("Web3 initialized successfully."));
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to initialize Web3 instance."));
    }
}

void APiCoinManager::BuyItem(FString ItemId, float Price)
{
    // Call the smart contract function to buy an item
    FString ContractAddress = TEXT("YOUR_CONTRACT_ADDRESS"); // Replace with your contract address
    Web3->SendTransaction(ContractAddress, ItemId, Price,
        [this](FString TransactionHash)
        {
            UE_LOG(LogTemp, Log, TEXT("Transaction successful: %s"), *TransactionHash);
            OnTransactionStatusChanged.Broadcast(FString::Printf(TEXT("Transaction successful: %s"), *TransactionHash));
            TransactionHistory.Add(TransactionHash); // Store transaction hash
        },
        [this](FString ErrorMessage)
        {
            UE_LOG(LogTemp, Error, TEXT("Transaction failed: %s"), *ErrorMessage);
            OnTransactionStatusChanged.Broadcast(FString::Printf(TEXT("Transaction failed: %s"), *ErrorMessage));
        });
}

void APiCoinManager::CheckBalance()
{
    // Check the balance of the wallet
    FString ContractAddress = TEXT("YOUR_CONTRACT_ADDRESS"); // Replace with your contract address
    Web3->GetBalance(ContractAddress,
        [this](float Balance)
        {
            UE_LOG(LogTemp, Log, TEXT("Balance: %f Pi Coins"), Balance);
            OnBalanceUpdated.Broadcast(Balance);
        },
        [this](FString ErrorMessage)
        {
            UE_LOG(LogTemp, Error, TEXT("Failed to check balance: %s"), *ErrorMessage);
        });
}

TArray<FString> APiCoinManager::GetTransactionHistory() const
{
    return TransactionHistory;
}

void APiCoinManager::SetContractAddress(FString Address)
{
    ContractAddress = Address;
}

void APiCoinManager::SetPrivateKey(FString Key)
{
    PrivateKey = Key;
}
