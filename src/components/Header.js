import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ userAddress }) => {
    return (
        <header style={styles.header}>
            <h1 style={styles.title}>My Advanced dApp</h1>
            <nav>
                <Link to="/" style={styles.link}>Home</Link>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                {userAddress && <span style={styles.userAddress}>Connected: {userAddress}</span>}
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#282c34',
        color: 'white',
    },
    title: {
        margin: 0,
    },
    link: {
        margin: '0 10px',
        color: 'white',
        textDecoration: 'none',
    },
    userAddress: {
        marginLeft: '20px',
    },
};

export default Header;
