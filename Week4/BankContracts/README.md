# SaveERC20 Smart Contract Project

This project contains two smart contracts: `Web3CXI` and `SaveERC20`. The `Web3CXI` contract is an ERC20 token implementation, while the `SaveERC20` contract allows users to deposit, withdraw, and transfer ERC20 tokens.

## Table of Contents

- [Contracts Overview](#contracts-overview)
- [Setup Instructions](#setup-instructions)
- [Testing the Contracts](#testing-the-contracts)
- [Deployment](#deployment)
- [Interacting with the Contracts](#interacting-with-the-contracts)
- [Verification](#verification)

## Contracts Overview

### Web3CXI

- **Purpose**: An ERC20 token contract.
- **Key Features**:
  - Minting: The owner can mint new tokens.
  - Initial Supply: 100,000 WCXI tokens minted to the owner upon deployment.

### SaveERC20

- **Purpose**: A contract that allows users to save ERC20 tokens by depositing, withdrawing, and transferring them.
- **Key Features**:
  - Deposit: Users can deposit ERC20 tokens into the contract.
  - Withdraw: Users can withdraw their deposited tokens.
  - Transfer: Users can transfer tokens to other users within the contract.
  - Owner Functions: The owner can withdraw tokens from the contract and access other users' balances.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git https://github.com/Lukman-01/Web3Bridge.git
   cd Week4/BankContract
   ```

2. **Install dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PRIVATE_KEY=<your_private_key>
   LISK_RPC_URL=<your_lisk_rpc_url>
   ```

## Testing the Contracts

The tests are written using the Hardhat framework with Chai assertions. They cover various scenarios, including contract deployment, deposits, withdrawals, and event emissions.

To run the tests, use the following command:

```bash
npx hardhat test
```

## Deployment

To deploy the contracts to the Lisk Sepolia testnet, follow these steps:

1. **Deploy the `Token` contract**:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/Token.ts --network lisk-sepolia

   Update the Web3CXI contract address in the SaveERC20 deploy script.

2. **Deploy the `SaveERC20` contract**:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/SaveERC20.ts --network lisk-sepolia
   ```

   Ensure the `SaveERC20` contract's module file (`SaveERC20.ts`) is correctly configured for deployment.

3. **Record the deployed contract addresses**:
   Deployed Addresses

   TokenModule#Token - 0x4836F1CeE8561f8137f4AFd4b3C6594e4aCFD663
   SaveERC20Module#SaveERC20 - 0x0aEf452F1bd534cc3F62B15057188fF53B395bf2

   Verifying deployed contracts

   Verifying contract "contracts/Token.sol:Token" for network lisk-sepolia...
   Successfully verified contract "contracts/Token.sol:Token" for network lisk-sepolia:
   - https://sepolia-blockscout.lisk.com//address/0x4836F1CeE8561f8137f4AFd4b3C6594e4aCFD663#code

   Verifying contract "contracts/SaveERC20.sol:SaveERC20" for network lisk-sepolia...
   Successfully verified contract "contracts/SaveERC20.sol:SaveERC20" for network lisk-sepolia:
   - https://sepolia-blockscout.lisk.com//address/0x0aEf452F1bd534cc3F62B15057188fF53B395bf2#code

## Interacting with the Contracts

After deploying the contracts, you can interact with them using a script. Here's how:

1. **Edit the interaction script (`scripts/interaction.ts`)**:
   - Update the `TokenAddress` and `saveERC20ContractAddress` variables with the deployed addresses.

2. **Run the interaction script**:
   ```bash
   npx hardhat run scripts/interaction.ts --network lisk-sepolia
   ```

   The script will approve, deposit, and withdraw tokens from the `SaveERC20` contract and log the balances before and after each operation.

3. The screenshot for the interaction is saved in image folder.


### Authors

Abdulyekeen Lukman(Ibukun)