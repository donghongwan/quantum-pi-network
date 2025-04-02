// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { getUser Data } from '../utils/api'; // Assume this is a utility function to fetch user data

const Dashboard = ({ userAddress }) => {
    const [userData, setUser Data] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUser Data(userAddress);
                setUser Data(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userAddress) {
            fetchData();
        }
    }, [userAddress]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={styles.dashboard}>
            <h2>User Dashboard</h2>
            {userData ? (
                <div>
                    <h3>Your Staked Tokens: {userData.stakedTokens}</h3>
                    <h3>Your Rewards: {userData.rewards}</h3>
                </div>
            ) : (
                <p>No data available. Please stake tokens to see your dashboard.</p>
            )}
        </div>
    );
};

const styles = {
    dashboard: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow:'0 2px 10px rgba(0, 0, 0, 0.1)',
    },
};

export default Dashboard;
