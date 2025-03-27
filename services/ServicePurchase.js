import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ComputeMarketplace from './ComputeMarketplace.json'; // ABI of the smart contract

const ServicePurchase = ({ marketplaceAddress }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchServices = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(marketplaceAddress, ComputeMarketplace.abi, provider);
            const serviceCount = await contract.serviceCount();

            const servicesArray = [];
            for (let i = 1; i <= serviceCount; i++) {
                const service = await contract.services(i);
                servicesArray.push(service);
            }
            setServices(servicesArray);
        } catch (err) {
            setError('Failed to fetch services. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const purchaseService = async (serviceId) => {
        const confirmed = window.confirm('Are you sure you want to purchase this service?');
        if (!confirmed) return;

        setError('');
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(marketplaceAddress, ComputeMarketplace.abi, signer);

            const tx = await contract.purchaseService(serviceId);
            await tx.wait();
            alert('Service purchased successfully!');
            fetchServices(); // Refresh the service list after purchase
        } catch (err) {
            setError('Failed to purchase service. Please check your balance and try again.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Available Services</h2>
            {loading && <p>Loading services...</p>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {services.map((service, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        <div>
                            <strong>{service.description}</strong> - {ethers.utils.formatUnits(service.price, 'ether')} Pi Coin
                            {service.isActive ? (
                                <button onClick={() => purchaseService(index + 1)} style={{ marginLeft: '10px' }}>
                                    Purchase
                                </button>
                            ) : (
                                <span style={{ color: 'gray', marginLeft: '10px' }}> (Expired)</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServicePurchase;
