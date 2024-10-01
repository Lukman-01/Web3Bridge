# NFT Airdrop

This repository contains a smart contract for distributing ERC20 tokens to eligible NFT holders through an airdrop mechanism. The airdrop is verified using a Merkle tree, ensuring that only specified addresses can claim tokens. The project is designed to work with the Ethereum blockchain and is configured for development using Hardhat.

## Overview

### NFT Airdrop Smart Contract

The `NFTAirdrop` contract allows the owner to distribute tokens to eligible users based on their NFT ownership and Merkle proof verification. Key features include:

- **Token Deposits**: The contract owner can deposit ERC20 tokens for distribution.
- **Merkle Tree Verification**: Users can claim tokens if they provide a valid Merkle proof.
- **NFT Ownership Check**: Users must own a Bored Ape Yacht Club (BAYC) NFT to be eligible for the airdrop.
- **Owner Controls**: The contract owner can update the Merkle root and withdraw remaining tokens.

### Key Errors

- **ZeroAddressNotAllowed**: Reverts when a zero address is provided.
- **UserAlreadyClaimed**: Reverts if the user has already claimed their tokens.
- **SorryYouAreNotEligible**: Reverts if the user is not eligible for the claim.
- **YouDontHaveBAYCNFT**: Reverts if the user does not own a BAYC NFT.

### Key Events

- **UserClaimedTokens**: Emitted when a user successfully claims tokens.
- **DepositIntoContractSuccessful**: Emitted when tokens are successfully deposited into the contract.

## Prerequisites

Before setting up and deploying the smart contract, ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- Hardhat
- An Ethereum wallet with testnet tokens (e.g., Sepolia)
- Alchemy account (for RPC URL)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/nft-airdrop.git
   cd nft-airdrop
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**:

   Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   ALCHEMY_MAINNET_API_KEY_URL=<your_alchemy_mainnet_api_key_url>
   ACCOUNT_PRIVATE_KEY=<your_private_key>
   ```

## Smart Contract Deployment

1. **Compile the Smart Contract**:

   Compile the `NFTAirdrop` contract using Hardhat:

   ```bash
   npx hardhat compile
   ```

2. **Deploy the Smart Contract**:

   Deploy the contract to the desired network (e.g., Sepolia):

   ```bash
   npx hardhat ignition deploy ./ignition/modules/deploy.ts 
   ```

   Deployed Addresses

    LockModule#AirdropToken - 0x81ED8e0325B17A266B2aF225570679cfd635d0bb
    LockModule#NFTAirdrop - 0x6B763F54D260aFF608CbbAeD8721c96992eC24Db

## Generating the Merkle Tree

To generate the Merkle tree from a CSV file containing eligible addresses and token amounts:

1. **Prepare a CSV File**:

   Create a CSV file (e.g., `eligible_addresses.csv`) with the following format:

   ```csv
   address,amount
   0xAddress1,100
   0xAddress2,200
   ```

2. **Run the Merkle Tree Generation Script**:

   Execute the following command to generate the Merkle tree and proofs:

   ```bash
   node scripts/merkle.js airdrop.csv
   ```

   This will create a `proofs.json` file containing the Merkle proofs for each address.

## Testing

You can write and run tests for the smart contract using the Hardhat testing framework. Create test scripts in the `test` folder and run:

```bash
npx hardhat test
```

## Project Configuration

Your Hardhat configuration file (`hardhat.config.js`) should look like this:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_MAINNET_API_KEY_URL = process.env.ALCHEMY_MAINNET_API_KEY_URL;
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.26",
  networks: {
    hardhat: {
      forking: {
        url: ALCHEMY_MAINNET_API_KEY_URL,
      }
    }
  },
  lockGasLimit: 200000000000,
  gasPrice: 10000000000,
};
```

### Authors

Abdulyekeen Lukman (Ibukun)
