const QuantumResistantMultiSigWallet = artifacts.require("QuantumResistantMultiSigWallet");

contract("QuantumResistantMultiSigWallet", (accounts) => {
    let wallet;
    const [owner1, owner2, owner3, nonOwner] = accounts;
    const requiredSignatures = 2;

    beforeEach(async () => {
        wallet = await QuantumResistantMultiSigWallet.new([owner1, owner2, owner3], requiredSignatures);
    });

    it("should allow owners to create a transaction", async () => {
        await wallet.createTransaction(owner2, web3.utils.toWei("1", "ether"), { from: owner1 });
        const transaction = await wallet.transactions(0);
        assert.equal(transaction.to, owner2, "Transaction recipient is incorrect");
        assert.equal(transaction.value.toString(), web3.utils.toWei("1", "ether"), "Transaction value is incorrect");
        assert.isFalse(transaction.executed, "Transaction should not be executed yet");
    });

    it("should not allow non-owners to create a transaction", async () => {
        try {
            await wallet.createTransaction(owner2, web3.utils.toWei("1", "ether"), { from: nonOwner });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("Not an owner"), "Error message does not match");
        }
    });

    it("should allow owners to sign a transaction", async () => {
        await wallet.createTransaction(owner2, web3.utils.toWei("1", "ether"), { from: owner1 });
        await wallet.signTransaction(0, { from: owner1 });
        const transaction = await wallet.transactions(0);
        assert.equal(transaction.signatureCount.toString(), "1", "Signature count should be 1");
    });

    it("should not allow the same owner to sign a transaction multiple times", async () => {
        await wallet.createTransaction(owner2, web3.utils.toWei("1", "ether"), { from: owner1 });
        await wallet.signTransaction(0, { from: owner1 });
        try {
            await wallet.signTransaction(0, { from: owner1 });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("Transaction already signed"), "Error message does not match");
        }
    });

    it("should execute the transaction when enough signatures are collected", async () => {
        await wallet.createTransaction(owner2, web3.utils.toWei("1", "ether"), { from: owner1 });
        await wallet.signTransaction(0, { from: owner1 });
        await wallet.signTransaction(0, { from: owner2 });
        const initialBalance = await web3.eth.getBalance(owner2);
        await wallet.signTransaction(0, { from: owner3 });
        const finalBalance = await web3.eth.getBalance(owner2);
        assert.isTrue(finalBalance > initialBalance, "Transaction should have been executed");
    });

    it("should not allow execution of already executed transactions", async () => {
        await wallet.createTransaction(owner2, web3.utils.toWei("1", "ether"), { from: owner1 });
        await wallet.signTransaction(0, { from: owner1 });
        await wallet.signTransaction(0, { from: owner2 });
        await wallet.signTransaction(0, { from: owner3 });
        const transaction = await wallet.transactions(0);
        assert.isTrue(transaction.executed, "Transaction should be executed");

        try {
            await wallet.signTransaction(0, { from: owner1 });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("Transaction already executed"), "Error message does not match");
        }
    });

    it("should reset votes after execution", async () => {
        await wallet.createTransaction(owner2, web3.utils.toWei("1", "ether"), { from: owner1 });
        await wallet.signTransaction(0, { from: owner1 });
        await wallet.signTransaction(0, { from: owner2 });
        await wallet.signTransaction(0, { from: owner3 });
        const transaction = await wallet.transactions(0);
        assert.isTrue(transaction.executed, "Transaction should be executed");
        assert.equal(transaction.signatureCount.toString(), "3", "Signature count should be reset after execution");
    });
});
