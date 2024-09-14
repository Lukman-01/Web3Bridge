# Multisig Wallet & ERC-20 Token Project

This project implements a **Multisignature Wallet** (Multisig) and an **ERC-20 Token** smart contract. The multisig wallet allows multiple signers to approve token transfers, and a certain number of signers (a quorum) must agree before a transfer can be executed. This project also includes tests to verify the correct functionality of the multisig wallet and the ERC-20 token integration.

## Project Structure

```bash
├── contracts
│   ├── MultiSig.sol            # The multisignature wallet contract
│   ├── MultisigFactory.sol     # Factory contract to create instances of MultiSig wallets
│   ├── Token.sol               # Custom ERC-20 Token implementation (TKN)
│   └── interfaces              # Optional: Interfaces for additional modularity
│
├── test
│   └── multisig-test.ts        # Test cases for the multisig wallet and token contract
│
├── hardhat.config.ts           # Hardhat configuration for project settings
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
└── .env                        # Environment variables for deploying and testing
```

## Features

### 1. **Multisignature Wallet (MultiSig.sol)**
   - A wallet that requires multiple valid signers to approve transactions before they are executed.
   - Signers are defined during the wallet creation and can propose transfers or approve transactions.
   - The wallet ensures that:
     - A quorum of signers must approve each transaction.
     - Only valid signers can propose or approve transactions.
     - Transactions can be canceled, but not if they are already completed.
     - The contract supports changing the quorum dynamically, as long as it stays within valid bounds.

### 2. **ERC-20 Token (Token.sol)**
   - A custom ERC-20 token named **TKN** with a fixed supply of `100,000 TKN`.
   - The token contract includes a minting function restricted to the contract owner.
   - Tokens can be transferred to the multisig wallet and used in multisig transactions.

### 3. **MultisigFactory (MultisigFactory.sol)**
   - A factory contract that creates new instances of the `MultiSig` wallet.
   - Each instance of a `MultiSig` wallet can have different quorum settings and signers.

### 4. **Unit Tests**
   - Comprehensive tests are written in TypeScript using the Hardhat framework and Chai for assertions.
   - The test suite covers:
     - Deployment of the multisig and token contracts.
     - Transaction approval logic.
     - Token transfers from the multisig wallet.
     - Edge cases like invalid signers, insufficient funds, and approval edge cases.

## Installation

### Prerequisites
- Node.js >= 14.x
- Hardhat framework
- Solidity >= 0.8.24

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
   cd Week5/MultiSig
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your `.env` file:**

   Create a `.env` file in the root of your project with the following variables:

   ```bash
   LISK_RPC_URL=<your_sepolia_rpc_url>
   PRIVATE_KEY=<your_private_key>
   ```

4. **Compile the contracts:**

   ```bash
   npx hardhat compile
   ```

5. **Run tests:**

   ```bash
   npx hardhat test
   ```

## Deployment

1. **Configure the network in `hardhat.config.ts`:**

   The project is set up to work with the Sepolia testnet. Update your RPC URL and private key in the `.env` file, and ensure that the configuration looks like this:

   ```ts
   networks: {
     "lisk-sepolia": {
       url: process.env.LISK_RPC_URL!,
       accounts: [process.env.PRIVATE_KEY!],
       gasPrice: 1000000000,
     },
   },
   ```

2. **Deploy the contracts:**

   To deploy the contracts to Sepolia, run the following command:

   ```bash
   npx hardhat ignition deploy ./ignition/modules/MultiSig.ts --network lisk-sepolia
   ```

   After deployment, note the contract addresses that are printed in the console.

## Testing

Tests are located in the `test/` directory and written using Hardhat’s testing framework.

To run all the tests:

```bash
npx hardhat test
```

The tests cover:

- Deployment of the `MultiSig` and `Token` contracts.
- Multisig transaction creation and approval.
- Token transfers with multisig approval.
- Edge cases such as invalid signers, quorum changes, and more.
