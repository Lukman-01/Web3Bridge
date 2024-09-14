# OnChainNFT

The `OnChainNFT` contract is an Ethereum smart contract for creating and managing NFTs with on-chain metadata. It allows you to mint NFTs where the metadata, including SVG images, is stored directly on the blockchain.

## Features

- **SVG to Base64 Conversion**: Converts SVG images to Base64 encoded strings for on-chain storage.
- **Dynamic Metadata**: Generates and manages token metadata directly on-chain.
- **Owner-Only Minting**: Only the contract owner can mint new NFTs.
- **Event Logging**: Emits an event whenever a new NFT is minted.

## Contract Overview

### `OnChainNFT`

- **Inherits**:
  - `ERC721URIStorage`: Provides functionality for storing and managing token URIs.
  - `Ownable`: Restricts certain functions to the contract owner.

### Functions

- **`svgToImageURI(string memory svg)`**:
  - Converts an SVG string into a Base64 encoded URI.
  - **Usage**: Used internally to convert SVG data to an image URI.

- **`formatTokenURI(string memory imageURI)`**:
  - Formats the token metadata URI, including the Base64 encoded image.
  - **Usage**: Used internally to generate the token metadata.

- **`mint(string memory svg)`**:
  - Mints a new NFT with the provided SVG image.
  - **Usage**: Only callable by the contract owner to create new NFTs.

### Events

- **`Minted(uint256 tokenId)`**:
  - Emitted when a new NFT is minted.
  - **Parameters**:
    - `tokenId`: The ID of the newly minted token.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Hardhat
- Alchemy API key (for deployment)
- Etherscan API key (for contract verification)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
   cd Week5/On-Chain-SVG-NFT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following content:
   ```env
   ALCHEMY_HTTP_URL=https://eth-sepolia.alchemyapi.io/v2/your-api-key
   PRIVATE_KEY=your-private-key
   ETHERSCAN_API_KEY=your-etherscan-api-key
   ```

### Usage

1. **Compile Contracts**:
   ```bash
   npx hardhat compile
   ```

2. **Deploy Contracts**:
   Create a deployment script (e.g., `scripts/deploy.ts`) and run:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/MultiSig.ts --network lisk-sepolia
   ```