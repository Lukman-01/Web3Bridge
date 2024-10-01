# Airdrop Smart Contract and Merkle Tree Generator

## Overview

This project consists of a Solidity smart contract for handling an ERC20 token airdrop using a Merkle Tree for eligibility verification, and a Node.js script for generating the Merkle Tree and proofs from a CSV file. The project is configured to deploy on the Lisk Sepolia network.

## Project Structure

- **contracts/**: Contains the Solidity smart contracts:
  - `AirdropContract.sol`: The main contract for the airdrop, enabling eligible users to claim tokens.
  - `AirdropToken.sol`: A basic ERC20 token contract used for the airdrop.
- **scripts/**: Contains the Node.js script for generating the Merkle Tree and proofs:
  - `generateMerkleTree.js`: Reads a CSV file of addresses and amounts, generates a Merkle Tree, and outputs the proofs in JSON format.
- **hardhat.config.js**: Configuration file for the Hardhat development environment.
- **.env**: Environment variables file for storing sensitive data like the deployer's private key.
- **proofs.json**: The output file from the `generateMerkleTree.js` script, containing the Merkle proofs for each address.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine.
- **Hardhat**: Hardhat is used for compiling, deploying, and interacting with the smart contracts.
- **dotenv**: Used to manage environment variables.
- **OpenZeppelin Contracts**: The project uses OpenZeppelin's library for standard ERC20 and utility functions.
- **Lisk Sepolia Network**: The project is configured to deploy on the Lisk Sepolia testnet.

## Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
   cd Week4/Airdrop_Merkle_Tree
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory with the following content:
   ```plaintext
   PRIVATE_KEY = your_private_key
   ```
   Replace `your_private_key_here` with the private key of the account that will deploy the contracts.

4. **Compile Contracts:**
   Compile the Solidity contracts using Hardhat:
   ```bash
   npx hardhat compile
   ```

5. **Generate the Merkle Tree and Proofs:**
   Ensure you have a CSV file containing the eligible addresses and amounts. The format should be as follows:
   ```plaintext
   address,amount
   0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,20
   0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,20
   ```
   Run the Merkle Tree generator:
   ```bash
   node scripts/merkle.js your-file.csv
   ```
   This will create a `proofs.json` file containing the Merkle proofs.

6. **Deploy the Contracts:**
   Deploy the contracts to the Lisk Sepolia network:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/deploy.js --network lisk-sepolia 
   ```

   ```bash
   npx hardhat verify --network lisk-sepolia 0x12C416184C0962fbbd46d10a63D65BDDD0BC002f 0xBF7F035328bA48D9C77F31A8e5f6816d0E92dfC1 0x8f274e5f685051d5e320a9b9de911f3d3d5388eb6dfbb1ace1f685cc03ef9da4
   ```

### Deployment Details

- Wallet address for deployment: 0x40feacdeee6f017fA2Bc1a8FB38b393Cf9022d71

- CrowdFunding contract deployed to: 0xC03814F91a4Ae88A5f5d18F005e72A8D55218b75

- Successfully verified contract link: [Lisk Sepolia Blockscout Link](https://sepolia-blockscout.lisk.com/address/0x12C416184C0962fbbd46d10a63D65BDDD0BC002f#code)

## Usage

- **Depositing Tokens into the Airdrop Contract:**
  Only the contract owner can deposit tokens into the airdrop contract using the `depositIntoContract` function.

- **Claiming Tokens:**
  Eligible users can claim their tokens by providing the appropriate Merkle proof and the claim amount.

- **Updating the Merkle Root:**
  The contract owner can update the Merkle root using the `UpdateMerkleRoot` function.

- **Withdrawing Remaining Tokens:**
  The contract owner can withdraw any unclaimed tokens from the contract.

### Authors

Abdulyekeen Lukman(Ibukun)
