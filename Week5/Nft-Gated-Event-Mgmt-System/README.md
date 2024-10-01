# NFT-Gated Event Management System

## Project Overview

The **NFT-Gated Event Management System** allows event organizers to manage access to events using NFTs (Non-Fungible Tokens). This system provides a decentralized and secure way to manage event participation, where only holders of specific NFTs can gain access to exclusive events.

The project is built on Ethereum and leverages smart contracts to manage event access and NFT ownership verification. The system includes the following components:

1. **MyNFT Contract**: A smart contract for minting and managing NFTs that act as event tickets.
2. **NFTGatedEventManager Contract**: A smart contract that controls access to events, checking NFT ownership before allowing entry.
3. **Base64 Utility**: A utility for encoding and decoding data in Base64 format, often used for handling NFT metadata.

## Features

- **Mint NFTs**: Organizers can create NFTs that act as tickets for events.
- **Verify NFT Ownership**: Access to events is restricted to holders of specific NFTs.
- **Secure Event Access**: Decentralized smart contracts ensure that event access cannot be bypassed or tampered with.
- **Easy Integration**: The system can be integrated with various decentralized platforms for seamless event management.

## Project Structure

### Contracts
- **MyNFT.sol**: Handles the minting and management of NFTs. Each NFT can be tied to a specific event.
- **NFTGatedEventManager.sol**: This contract verifies NFT ownership and manages event access. It interacts with the `MyNFT` contract to ensure only valid NFT holders can participate.
- **Base64.sol**: A helper contract for encoding and decoding metadata into Base64 format, useful for storing NFT metadata on-chain.

### Workflow

1. **Minting NFT Tickets**: Organizers deploy the `MyNFT` contract and mint NFTs that serve as event tickets. Each NFT represents a ticket to a particular event.
2. **Event Registration**: When a user tries to register for an event, the `NFTGatedEventManager` checks the user's wallet to confirm they hold the required NFT.
3. **Event Participation**: Only users who own the event-specific NFT are granted access to the event.

## Setup Instructions

### Prerequisites

- **Node.js**: Ensure that you have Node.js installed (v16+ recommended).
- **Hardhat**: A development environment for Ethereum smart contract testing and deployment.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
   cd Week5/Nft-Gated-Event-Mgmt-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory:
   ```bash
   INFURA_ID=<your-infura-project-id>
   WALLET_KEY=<your-wallet-private-key>
   ETHERSCAN_API_KEY=<your-etherscan-api-key>
   ```

### Smart Contract Deployment

1. Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```

2. Deploy the contracts to the desired network (e.g., Sepolia):
   ```bash
   npx hardhat ignition deploy ./ignition/modules/NFTGatedEventManager.ts --network lisk-sepolia --verify
   ```

   Deployed Addresses

   MyNFTModule#MyNFT - 0x106568A18A91Ad0FFb567E761caEDDE0E47d2382
   EventManageModule#NFTGatedEventManager - 0x7c8EF04F30Ea74B14Ded5A210bB8288382BE140b

   Verifying deployed contracts

   Verifying contract "contracts/MyNFT.sol:MyNFT" for network lisk-sepolia...
   Contract contracts/MyNFT.sol:MyNFT already verified on network lisk-sepolia:
   - https://sepolia-blockscout.lisk.com//address/0x106568A18A91Ad0FFb567E761caEDDE0E47d2382#code

   Verifying contract "contracts/NFTGatedEventManager.sol:NFTGatedEventManager" for network lisk-sepolia...
   Successfully verified contract "contracts/NFTGatedEventManager.sol:NFTGatedEventManager" for network lisk-sepolia:
   - https://sepolia-blockscout.lisk.com//address/0x7c8EF04F30Ea74B14Ded5A210bB8288382BE140b#code
