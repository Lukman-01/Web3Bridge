# Ordered Swap Factory

**Ordered Swap Factory** is a decentralized smart contract-based project for creating and managing token swaps. It enables users to create custom swap orders where they deposit a token and specify another token they'd like to receive in return. Other users can fill these orders by providing the requested tokens. The project consists of two smart contracts:
- `OrderedSwap`: Manages individual token swap orders.
- `SwapFactory`: Facilitates the creation of `OrderedSwap` contracts and tracks all active swaps.

## Features

- **Create Swap Orders**: Users can create orders by depositing a token and specifying the token they expect in return.
- **Fill Swap Orders**: Others can fulfill these orders by depositing the expected tokens, receiving the deposited tokens in return.
- **Cancel Orders**: The creator of an order can cancel it and retrieve their deposited tokens, as long as the order hasn’t been filled.
- **Factory System**: A factory contract is provided to create multiple `OrderedSwap` instances and track them.

## Technologies Used

- **Solidity (v0.8.24)**: Smart contract language.
- **Hardhat**: Development environment for compiling, testing, and deploying smart contracts.
- **OpenZeppelin**: Secure and reusable Solidity components.
- **ERC-20**: Standard interface for fungible tokens in Ethereum.
- **Node.js & npm**: Package manager and runtime for JavaScript tools.


## Installation

Clone the repository and install the required dependencies:

```bash
git clone https://github.com/Lukman-01/Web3Bridge.git
cd Week6/Order-Based-Swap
npm install
```

## Deployment

### Deploy to Sepolia Testnet

1. Make sure to configure your `.env` file with your wallet private keys and Infura credentials.

2. Compile the contracts:

```bash
npx hardhat compile
```

3. Deploy to Lisk Sepolia:

```bash
npx hardhat ignition deploy ./ignition/modules/deploy.ts --network lisk-sepolia --verify
```

Deployed Addresses

ContractsModule#GUZToken - 0xE35fd46855D592a67327d857a1a452b213E8d44d
ContractsModule#OrderedSwap - 0xBfBF3bd2c91dd6B3DBc34c1b54dD0eF07C32af46
ContractsModule#W3BToken - 0xF2E6B16435749EC715BeAead4CE9Ec6680713dba

Verifying deployed contracts

Verifying contract "contracts/GUZToken.sol:GUZToken" for network lisk-sepolia...
Successfully verified contract "contracts/GUZToken.sol:GUZToken" for network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0xE35fd46855D592a67327d857a1a452b213E8d44d#code

Verifying contract "contracts/OrderedSwap.sol:OrderedSwap" for network lisk-sepolia...
Successfully verified contract "contracts/OrderedSwap.sol:OrderedSwap" for network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0xBfBF3bd2c91dd6B3DBc34c1b54dD0eF07C32af46#code

Verifying contract "contracts/W3BToken.sol:W3BToken" for network lisk-sepolia...
Successfully verified contract "contracts/W3BToken.sol:W3BToken" for network lisk-sepolia:
  - https://sepolia-blockscout.lisk.com//address/0xF2E6B16435749EC715BeAead4CE9Ec6680713dba#code

## Usage

### Interacting with OrderedSwap

- **Create a Swap Order**: Users can call the `createOrder()` function to specify the token to deposit and the token they expect in return.
- **Fill a Swap Order**: Others can call `fillOrder()` to fulfill the order by depositing the expected token and receiving the deposited token.
- **Cancel an Order**: Creators can cancel an order using `cancelOrder()` and retrieve their deposited tokens.

### SwapFactory

- The `SwapFactory` contract allows users to create new instances of `OrderedSwap` contracts.
- The contract tracks all created swap instances and provides a `getAllSwaps()` function to retrieve the addresses of all swap contracts.

### Authors

Abdulyekeen Lukman (Ibukun)