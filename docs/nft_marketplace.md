# NFT Marketplace

## Overview
The NFT marketplace allows users to create, buy, sell, and trade non-fungible tokens (NFTs) on the Quantum Pi Network. This feature enables artists, creators, and collectors to engage in a vibrant digital economy.

## Key Features
- **Minting NFTs**: Create unique digital assets.
- **Marketplace Transactions**: Buy and sell NFTs securely.
- **Royalties**: Implement royalty mechanisms for creators.

## Implementation Steps

### 1. Setting Up NFT Service
- The NFT service is located in `src/nft/NFTService.js`.
- Import the service in your application:

  ```javascript
  const NFTService = require('./nft/NFTService');
  ```

### 2. Minting a New NFT
- Use the mintNFT method to create a new NFT.

  ```javascript
  1 const newNFT = await NFTService.mintNFT({
  2     creator: 'artist123',
  3     metadata: {
  4         title: 'Digital Artwork',
  5         description: 'A unique piece of digital art',
  6         image: 'url_to_image'
  7     }
  8 });
  ```

### 3. Listing NFTs for Sale
- Use the listNFT method to put an NFT up for sale.

  ```javascript
  1 await NFTService.listNFT(newNFT.id, {
  2     price: 0.5, // Price in ETH
  3     currency: 'ETH'
  4 });
  ```
  
### 4. Purchasing an NFT
- Use the purchaseNFT method to buy an NFT from the marketplace.

  ```javascript
  1 const purchaseResult = await NFTService.purchaseNFT(newNFT.id, {
  2     buyer: 'buyer456'
  3 });
  ```
  
## Conclusion
The NFT marketplace empowers users to engage in the digital asset economy, providing a platform for creativity and commerce. Follow the steps above to integrate NFT functionalities into your application.
