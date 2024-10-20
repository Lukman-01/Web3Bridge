# BankAccount

This Solidity program implements the `BankAccount` smart contract, providing basic functionality to manage user accounts, including creating accounts, depositing funds, transferring funds between accounts, and withdrawing funds. The contract also allows the contract owner to withdraw Ether directly from the contract balance.

## Description

The `BankAccount` contract is built on the Ethereum-compatible Lisk Sepolia network using Solidity. It includes the following functionalities:
- **Account Creation**: Users can create an account with their name and age.
- **Deposits**: Users can deposit Ether into their accounts.
- **Transfers**: Users can transfer Ether from their accounts to other users.
- **Withdrawals**: Users can withdraw Ether from their accounts.
- **Owner Withdrawals**: The contract owner can withdraw Ether directly from the contract balance.

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
   cd BankAccount
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
   npx hardhat ignition deploy ./ignition/modules/deploy.ts --network lisk-sepolia --verify
   ```

### Deployment Details

- Wallet address for deployment: 0x40feacdeee6f017fA2Bc1a8FB38b393Cf9022d71

- BankAccount contract deployed to: 0xCA2b7e76eAdAD48348d5f164d98C56BD9472457C

- Successfully verified contract link: [Lisk Sepolia Blockscout Link](https://sepolia-blockscout.lisk.com/address/0xCA2b7e76eAdAD48348d5f164d98C56BD9472457C#code)

### Authors

Abdulyekeen Lukman (Ibukun)