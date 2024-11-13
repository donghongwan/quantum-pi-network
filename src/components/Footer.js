// src/components/Footer.js

import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p style={styles.text}>© {new Date().getFullYear()} My Advanced dApp. All rights reserved.</p>
            <div style={styles.socialLinks}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.link}>Twitter</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={styles.link}>GitHub</a>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        padding: '20px',
        backgroundColor: '#282c34',
        color: 'white',
        textAlign: 'center',
    },
    text: {
        margin: 0,
    },
    socialLinks: {
        marginTop: '10px',
    },
    link: {
        margin: '0 10px',
        color: 'white',
        textDecoration: 'none',
    },
};

export default Footer;
