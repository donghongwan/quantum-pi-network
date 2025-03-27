import React, { useState } from 'react';
import { ethers } from 'ethers';
import DigitalConsciousness from './DigitalConsciousness.json'; // ABI of the smart contract

const ConsciousnessManager = ({ contractAddress }) => {
    const [encryptedData, setEncryptedData] = useState('');
    const [duration, setDuration] = useState(''); // Duration for data expiration
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const storeConsciousness = async () => {
        setMessage('');
        setLoading(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, DigitalConsciousness.abi, signer);

        try {
            // Validate inputs
            if (!encryptedData || !duration) {
                throw new Error('Both encrypted data and duration are required.');
            }
            if (parseInt(duration) <= 0) {
                throw new Error('Duration must be greater than zero.');
            }

            const tx = await contract.storeConsciousness(encryptedData, parseInt(duration));
            await tx.wait();
            setMessage('Consciousness data stored successfully!');
        } catch (error) {
            setMessage('Error storing consciousness data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const retrieveConsciousness = async () => {
        setMessage('');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, DigitalConsciousness.abi, provider);

        try {
            const data = await contract.retrieveConsciousness();
            setEncryptedData(data);
            setMessage('Consciousness data retrieved successfully!');
        } catch (error) {
            setMessage('Error retrieving consciousness data: ' + error.message);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Manage Your Digital Consciousness</h2>
            <textarea
                placeholder="Enter your encrypted data here"
                value={encryptedData}
                onChange={(e) => setEncryptedData(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
                type="number"
                placeholder="Duration (in seconds)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <button onClick={storeConsciousness} disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                {loading ? 'Storing...' : 'Store Consciousness'}
            </button>
            <button onClick={retrieveConsciousness} style={{ width: '100%', padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}>
                Retrieve Consciousness
            </button>
            <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>
        </div>
    );
};

export default ConsciousnessManager;
