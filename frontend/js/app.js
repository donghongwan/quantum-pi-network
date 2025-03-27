// Initialize Three.js scene
let scene, camera, renderer;

function initThreeJS() {
    // Create a scene
    scene = new THREE.Scene();
    
    // Set up camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add a light source
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Fetch and display NFTs
async function fetchNFTs() {
    try {
        const response = await axios.get('/api/marketplace/nfts');
        const nftList = document.getElementById('nftList');
        nftList.innerHTML = ''; // Clear existing NFTs

        response.data.forEach(nft => {
            const nftItem = document.createElement('div');
            nftItem.classList.add('nft-item');
            nftItem.innerHTML = `
                <h3>NFT ID: ${nft.id}</h3>
                <p>Owner: ${nft.owner}</p>
                <p>Token URI: ${nft.token_uri}</p>
                <button onclick="viewNFT(${nft.id})">View in 3D</button>
            `;
            nftList.appendChild(nftItem);
        });
    } catch (error) {
        console.error('Error fetching NFTs:', error);
    }
}

// View NFT in 3D
async function viewNFT(nftId) {
    try {
        const response = await axios.get(`/api/nft/${nftId}`);
        const nft = response.data;

        // Load the 3D model (assuming the token URI points to a 3D model)
        const loader = new THREE.GLTFLoader();
        loader.load(nft.token_uri, function (gltf) {
            scene.add(gltf.scene);
            animate(); // Start the animation loop
        }, undefined, function (error) {
            console.error('Error loading 3D model:', error);
        });
    } catch (error) {
        console.error('Error retrieving NFT details:', error);
    }
}

// Mint NFT
document.getElementById('mintForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const tokenURI = document.getElementById('tokenURI').value;

    try {
        const response = await axios.post('/api/nft/mint', {
            user_id: 'user123', // Replace with actual user ID
            token_uri: tokenURI
        });
        document.getElementById('mintResult').innerText = response.data.message;
        fetchNFTs(); // Refresh the NFT list after minting
    } catch (error) {
        document.getElementById('mintResult').innerText = error.response.data.error;
    }
});

// Initialize the application
initThreeJS();
fetchNFTs();
