# NFT Marketplace

A decentralized NFT marketplace built on Ethereum using Solidity, allowing users to mint, list, buy, and manage NFTs securely. This contract utilizes the ERC721 standard for non-fungible tokens, enabling seamless trading of unique digital assets.

## Features

- **Minting NFTs**: The contract owner can mint new NFTs.
- **Listing for Sale**: Owners can list their NFTs for sale at a specified price.
- **Buying NFTs**: Users can buy listed NFTs by sending Ether equivalent to the sale price.
- **Removing Listings**: NFT owners can remove their listings from sale.
- **Price Updates**: Sellers can update the sale price of their listed NFTs.
- **Withdrawal**: The contract owner can withdraw the contract's Ether balance.

## Contract Details

### Key Functions

- **Minting**: 
  - `function mint(address to)`: Mints a new NFT to the specified address.

- **Listing for Sale**:
  - `function listForSale(uint256 tokenId, uint256 price)`: Lists an NFT for sale at a specified price.

- **Buying NFTs**:
  - `function buy(uint256 tokenId)`: Allows users to purchase an NFT by sending the appropriate Ether amount.

- **Removing Listings**:
  - `function removeListing(uint256 tokenId)`: Removes an NFT from being listed for sale.

- **Updating Price**:
  - `function updatePrice(uint256 tokenId, uint256 newPrice)`: Updates the price of a listed NFT.

- **Withdraw**:
  - `function withdraw()`: Allows the owner to withdraw the contract's balance.

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- npm (Node package manager)
- Hardhat

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nft-marketplace
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```plaintext
   LISK_RPC_URL=<Your Lisk Sepolia RPC URL>
   PRIVATE_KEY=<Your wallet private key>
   ```

### Hardhat Configuration

The Hardhat configuration is set up to work with the Lisk Sepolia testnet. Here's the configuration file (`hardhat.config.ts`):

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    // for testnet
    "lisk-sepolia": {
      url: process.env.LISK_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
    apiKey: {
      "lisk-sepolia": "123",
    },
    customChains: [
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com/",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
```

### Deploying the Contract

1. Compile the contract:

   ```bash
   npx hardhat compile
   ```

2. Deploy the contract to the Lisk Sepolia testnet:

   ```bash
   npx hardhat ignition deploy ./ignition/modules/deploy.ts --network lisk-sepolia --verify
   ```

    Deployed Addresses

    NftMarketPlaceModule#NFTMarketplace - 0xDfb03c6dDC0cfca949a65A5d14Ce6c564a5fB918

    Verifying deployed contracts

    Verifying contract "contracts/NftMarketPlace.sol:NFTMarketplace" for network lisk-sepolia...
    Successfully verified contract "contracts/NftMarketPlace.sol:NFTMarketplace" for network lisk-sepolia:
    - https://sepolia-blockscout.lisk.com//address/0xDfb03c6dDC0cfca949a65A5d14Ce6c564a5fB918#code

### Authors

Abdulyekeen Lukman (Ibukun)


