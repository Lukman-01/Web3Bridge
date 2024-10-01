# AreaOfShapes

This Solidity program implements the `AreaOfShapes` smart contract, providing basic functionality to calculate the area of different geometric shapes, including squares, rectangles, and triangles. The contract is designed for educational purposes and demonstrates fundamental Solidity programming concepts.

## Description

The `AreaOfShapes` contract is built on the Ethereum-compatible Lisk Sepolia network using Solidity. It includes the following functionalities:
- **Square Area Calculation**: Calculates the area of a square given the length of its side.
- **Rectangle Area Calculation**: Calculates the area of a rectangle given its length and breadth.
- **Triangle Area Calculation**: Calculates the area of a triangle given its base and height.

This project includes a Hardhat setup for deploying and testing the smart contract on the Lisk Sepolia test network.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Hardhat
- An Ethereum wallet with Sepolia testnet funds
- `.env` file with your Lisk Sepolia RPC URL and private key

### Setting Up the Project

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
   cd Week3/AreaContract
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` File**

   Create a `.env` file in the root directory with the following content:

   ```bash
   PRIVATE_KEY=your_private_key
   ```

### Executing the Program

1. **Compile the Contract**

   ```bash
   npx hardhat compile
   ```

2. **Deploy the Contract**

   You can deploy the contract to the Lisk Sepolia testnet by running the following Hardhat task:

   ```bash
   npx hardhat ignition deploy ./ignition/modules/deploy.ts --network lisk-sepolia
   ```

### Deployment Details

- Wallet address for deployment: 0x40feacdeee6f017fA2Bc1a8FB38b393Cf9022d71

- AreaOfShapes contract deployed to: 0x1E2212649f12eA45685900675215871663c4B1fc

- Successfully verified contract link: [Lisk Sepolia Blockscout Link](https://sepolia-blockscout.lisk.com/address/0x1E2212649f12eA45685900675215871663c4B1fc#code)

### Authors

Abdulyekeen Lukman (Ibukun)