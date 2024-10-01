Here’s a sample README file for your repository based on the two smart contracts and the deployment to the Lisk blockchain:

---

# Ether and ERC20 Token Staking Contracts

This repository contains two smart contracts for staking Ether and ERC20 tokens on the Lisk blockchain. These contracts allow users to stake their assets and earn rewards based on a predefined daily reward rate.

## Overview

- **ERC20Staking**: This contract allows users to stake ERC20 tokens and earn rewards based on the amount staked and the duration of the stake.
- **EtherStaking**: This contract allows users to stake Ether and earn rewards based on the amount staked and the duration of the stake.

Both contracts are designed with security and efficiency in mind, using custom errors for gas optimization and following best practices to prevent reentrancy attacks.

## Features

- **Staking**: Users can stake their ERC20 tokens or Ether for a specified duration.
- **Rewards**: Rewards are calculated based on the staking duration and a configurable daily reward rate.
- **Withdrawal**: Users can withdraw their staked assets along with the rewards after the staking period has elapsed.
- **Owner Controls**: The contract owner can deposit assets, set the reward rate, and withdraw assets from the contract's balance.

## Deployment

The contracts are deployed on the Lisk-Sepolia testnet. The repository is configured to use Hardhat for contract development, testing, and deployment.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- Hardhat
- A Lisk wallet with testnet tokens

### Installation

1. Clone the repository:

   ```bash
   git https://github.com/Lukman-01/Web3Bridge.git
   cd Week4/StakingContract
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   LISK_RPC_URL=<your_lisk_sepolia_rpc_url>
   PRIVATE_KEY=<your_private_key>
   ```

### Compilation

Compile the smart contracts using Hardhat:

```bash
npx hardhat compile
```

### Deployment

Deploy the contracts to the Lisk-Sepolia testnet:

```bash
npx hardhat ignition deploy ./ignition/modules/SaveERC20.ts --network lisk-sepolia
```

Deployed Addresses

ERC20TokenModule#ERC20Token - 0xccA3A3d3a87c02ee547159569b14e18679CE83A7
ERC20StakingModule#ERC20Staking - 0x87E1b3f6975bbA4E3A07b36b3F1ae98A1785928f
EtherStakingModule#EtherStaking - 0x414Db5eB1DB3A8659AF4c683A9d037f567109611

Verifying deployed contracts

Verifying contract "contracts/ERC20Token.sol:ERC20Token" for network lisk-sepolia...
Contract contracts/ERC20Token.sol:ERC20Token already verified on network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0xccA3A3d3a87c02ee547159569b14e18679CE83A7#code

Verifying contract "contracts/ERC20Staking.sol:ERC20Staking" for network lisk-sepolia...
Contract contracts/ERC20Staking.sol:ERC20Staking already verified on network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0x87E1b3f6975bbA4E3A07b36b3F1ae98A1785928f#code

Verifying contract "contracts/EtherStaking.sol:EtherStaking" for network lisk-sepolia...
Successfully verified contract "contracts/EtherStaking.sol:EtherStaking" for network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0x414Db5eB1DB3A8659AF4c683A9d037f567109611#code