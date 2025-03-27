import React, { useState } from 'react';
import { ethers } from 'ethers';
import ComputeMarketplace from './ComputeMarketplace.json'; // ABI of the smart contract

const ServiceListing = ({ marketplaceAddress }) => {
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState(''); // Duration for service expiration
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const listService = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(marketplaceAddress, ComputeMarketplace.abi, signer);

            // Validate inputs
            if (!description || !price || !duration) {
                throw new Error('All fields are required.');
            }
            if (parseFloat(price) <= 0) {
                throw new Error('Price must be greater than zero.');
            }
            if (parseInt(duration) <= 0) {
                throw new Error('Duration must be greater than zero.');
            }

            const tx = await contract.listService(description, ethers.utils.parseUnits(price, 'ether'), duration);
            await tx.wait();
            setSuccess('Service listed successfully!');
        } catch (err) {
            setError(err.message || 'An error occurred while listing the service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>List a New Service</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <input
                type="text"
                placeholder="Service Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
                type="number"
                placeholder="Price in Pi Coin"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
                type="number"
                placeholder="Duration (in seconds)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <button onClick={listService} disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                {loading ? 'Listing...' : 'List Service'}
            </button>
        </div>
    );
};

export default ServiceListing;
