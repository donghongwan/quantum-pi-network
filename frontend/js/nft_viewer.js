// Initialize Three.js scene for NFT viewing
let viewerScene, viewerCamera, viewerRenderer;

function initViewer() {
    // Create a scene
    viewerScene = new THREE.Scene();
    
    // Set up camera
    viewerCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    viewerCamera.position.z = 5;

    // Set up renderer
    viewerRenderer = new THREE.WebGLRenderer({ antialias: true });
    viewerRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(viewerRenderer.domElement);

    // Add a light source
    const light = new THREE.AmbientLight(0xffffff, 1);
    viewerScene.add(light);

    // Handle window resize
    window.addEventListener('resize', onViewerWindowResize, false);
}

// Handle window resize for viewer
function onViewerWindowResize() {
    viewerCamera.aspect = window.innerWidth / window.innerHeight;
    viewerCamera.updateProjectionMatrix();
    viewerRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Render the viewer scene
function animateViewer() {
    requestAnimationFrame(animateViewer);
    viewerRenderer.render(viewerScene, viewerCamera);
}

// Load and display the NFT model
async function loadNFTModel(tokenURI) {
    const loader = new THREE.GLTFLoader();
    loader.load(tokenURI, function (gltf) {
        viewerScene.add(gltf.scene);
        animateViewer(); // Start the animation loop
    }, undefined, function (error) {
        console.error('Error loading 3D model:', error);
    });
}

// Function to initialize the viewer with the selected NFT
function initializeNFTViewer(tokenURI) {
    initViewer();
    loadNFTModel(tokenURI);
}

// Example usage: Call this function when a user selects an NFT to view
// This function should be called with the token URI of the selected NFT
function viewSelectedNFT(tokenURI) {
    initializeNFTViewer(tokenURI);
}

// Add event listener for viewing an NFT
document.querySelectorAll('.nft-item button').forEach(button => {
    button.addEventListener('click', function() {
        const tokenURI = this.getAttribute('data-token-uri'); // Assuming data-token-uri attribute is set
        viewSelectedNFT(tokenURI);
    });
});
