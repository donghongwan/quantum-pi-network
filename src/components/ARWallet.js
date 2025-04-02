// src/Components/ARWallet.js

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const ARWallet = () => {
    const [assets, setAssets] = useState([]);
    const [isARSupported, setIsARSupported] = useState(false);
    const sceneRef = useRef();

    useEffect(() => {
        // Check for AR support
        if (navigator.xr) {
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                setIsARSupported(supported);
            });
        }
    }, []);

    const fetchAssets = async () => {
        // Fetch user's digital assets from the blockchain or API
        // This is a placeholder for actual API call
        const userAssets = [
            { id: 1, name: 'Pi Coin', amount: 100 },
            { id: 2, name: 'Synthetic Asset', amount: 50 },
        ];
        setAssets(userAssets);
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleAssetClick = (asset) => {
        alert(`You clicked on ${asset.name}: ${asset.amount}`);
    };

    return (
        <div>
            <h1>Augmented Reality Wallet</h1>
            {isARSupported ? (
                <Canvas
                    ref={sceneRef}
                    style={{ width: '100%', height: '100vh' }}
                    onCreated={({ gl }) => {
                        gl.setClearColor('lightblue');
                        gl.xr.enabled = true;
                        document.body.appendChild(ARButton.createButton(gl));
                    }}
                >
                    {assets.map((asset) => (
                        <AssetModel key={asset.id} asset={asset} onClick={handleAssetClick} />
                    ))}
                </Canvas>
            ) : (
                <p>Your device does not support AR.</p>
            )}
        </div>
    );
};

const AssetModel = ({ asset, onClick }) => {
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01; // Rotate the asset model
        }
    });

    return (
        <mesh ref={meshRef} onClick={() => onClick(asset)} position={[Math.random() * 2 - 1, Math.random() * 2 - 1, -5]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={Math.random() * 0xffffff} />
            <Html>
                <div style={{ color: 'white', fontSize: '1.5em' }}>{asset.name}</div>
            </Html>
        </mesh>
    );
};

export default ARWallet;
