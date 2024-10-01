# Smart Contracts: Todo & StudentPortal

This repository contains two smart contracts: `Todo` and `StudentPortal`, both written in Solidity. These contracts allow users to manage to-do items and student records, respectively, on the Ethereum blockchain. The project is configured to work with the **Lisk Sepolia** testnet using **Hardhat** for development, testing, and deployment.

## Overview

### Todo Smart Contract

The `Todo` contract allows users to manage their to-do items with the following features:

- **Create To-Do Items**: Users can create new to-do items with a title and description.
- **Retrieve To-Do Items**: Users can retrieve all to-do items or a specific item by its index.
- **Update To-Do Status**: Users can toggle the status (`isDone`) of a to-do item to mark it as done or not done.

#### Key Events

- **TodoCreated**: Emitted when a new to-do item is created.
- **TodoUpdated**: Emitted when the status of a to-do item is updated.

### StudentPortal Smart Contract

The `StudentPortal` contract allows the owner (deployer) to manage student records with the following features:

- **Register Students**: The contract owner can register new students with details such as name, date of birth, email, LGA, state, and country.
- **Retrieve Student Records**: Anyone can retrieve the details of any registered student using their student ID.
- **Update Student Details**: The contract owner can update the details of an existing student.
- **Delete Student Records**: The contract owner can delete a student record.

#### Key Events

- **StudentCreated**: Emitted when a new student is registered.
- **StudentUpdated**: Emitted when a student’s details are updated.
- **StudentDeleted**: Emitted when a student record is deleted.

## Prerequisites

Before setting up and deploying the smart contracts, ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- Hardhat
- An Ethereum wallet with Sepolia testnet tokens
- Alchemy or Lisk RPC account (for Sepolia RPC URL)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
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
   LISK_RPC_URL=<your_lisk_rpc_url>
   PRIVATE_KEY=<your_private_key>
   ```

   These variables are used in the `hardhat.config.ts` file for deployment and verification on the Lisk Sepolia network.

## Hardhat Configuration

Your Hardhat configuration for the `lisk-sepolia` testnet should look like this:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    "lisk-sepolia": {
      url: process.env.LISK_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
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

## Compilation

Compile both smart contracts using Hardhat:

```bash
npx hardhat compile
```

## Deployment

Deploy the `Todo` and `StudentPortal` contracts to the Lisk Sepolia testnet:

```bash
npx hardhat run scripts/deploy.ts --network lisk-sepolia
```

After deployment, you'll be able to interact with both contracts for managing to-do items and student records on the Lisk Sepolia network.

## Testing

You can write and run tests for both smart contracts by creating test scripts in the `test` folder, then running the following command:

```bash
npx hardhat test
```

## Deployment

Deploy the `Todo` contract to the Sepolia testnet:

```bash
npx hardhat ignition deploy ./ignition/modules/deploy.ts --network sepolia
```


Deploying [ DeployContracts ]

Batch #1
  Executed DeployContracts#StudentPortal
  Executed DeployContracts#Todo

[ DeployContracts ] successfully deployed 🚀

Deployed Addresses

DeployContracts#StudentPortal - 0x8D3856Bc87420396885F51b1d158B400d5169050
DeployContracts#Todo - 0x04c3C6F7eCFB2ee2c5e66aaa309bd5B834634090

Verifying deployed contracts

Verifying contract "contracts/StudentPortal.sol:StudentPortal" for network lisk-sepolia...
Successfully verified contract "contracts/StudentPortal.sol:StudentPortal" for network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0x8D3856Bc87420396885F51b1d158B400d5169050#code

Verifying contract "contracts/TodoList.sol:Todo" for network lisk-sepolia...
Successfully verified contract "contracts/TodoList.sol:Todo" for network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0x04c3C6F7eCFB2ee2c5e66aaa309bd5B834634090#code 


### Authors

Abdulyekeen Lukman(Ibukun)