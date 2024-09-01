# Todo Smart Contract

This repository contains a simple Todo smart contract written in Solidity. The contract allows users to create, update, and retrieve to-do items on the Ethereum blockchain. The project is configured to work with the Sepolia testnet using Hardhat for development, testing, and deployment.

## Overview

### Todo Smart Contract

The `Todo` contract allows users to manage their to-do items with the following features:

- **Create To-Do Items**: Users can create new to-do items with a title and description.
- **Retrieve To-Do Items**: Users can retrieve all to-do items or a specific item by its index.
- **Update To-Do Status**: Users can toggle the status (`isDone`) of a to-do item to mark it as done or not done.

### Key Events

- **TodoCreated**: Emitted when a new to-do item is created.
- **TodoUpdated**: Emitted when the status of a to-do item is updated.

## Prerequisites

Before setting up and deploying the smart contract, ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- Hardhat
- An Ethereum wallet with Sepolia testnet tokens
- Alchemy account (for Sepolia RPC URL)

## Installation

1. **Clone the Repository**:

   ```bash
   git https://github.com/Lukman-01/Web3Bridge.git
   cd Week4/TodoList
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
   ALCHEMY_HTTP_URL=<your_alchemy_http_url>
   PRIVATE_KEY=<your_private_key>
   ETHERSCAN_API_KEY=<your_etherscan_api_key>
   ```

   These variables are used in the `hardhat.config.ts` file for deployment and verification on the Sepolia network.

## Compilation

Compile the smart contract using Hardhat:

```bash
npx hardhat compile
```

## Deployment

Deploy the `Todo` contract to the Sepolia testnet:

```bash
npx hardhat ignition deploy ./ignition/modules/deploy.ts --network sepolia
```

 