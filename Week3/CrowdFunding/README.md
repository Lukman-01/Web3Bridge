# CrowdFunding Smart Contract

This Solidity program implements the `CrowdFunding` smart contract, providing functionality to create and manage fundraising campaigns, allowing users to donate to campaigns, claim refunds if campaign goals are not met, and enabling the campaign owner to withdraw funds upon successful completion of a campaign.

## Description

The `CrowdFunding` contract is built on the Ethereum blockchain using Solidity. It includes the following functionalities:
- **Campaign Creation**: Users can create fundraising campaigns with a title, description, benefactor address, goal (in wei), and a duration.
- **Donations**: Users can donate Ether to any active campaign.
- **Refunds**: If a campaign does not meet its goal by the deadline, contributors can claim a refund of their donations.
- **Campaign Completion**: Once a campaign's deadline is reached, the funds raised are transferred to the benefactor, and the campaign is marked as completed.
- **Owner Withdrawals**: The contract owner can withdraw any leftover Ether from the contract balance after all campaigns have ended.

This project includes a Hardhat setup for deploying and testing the smart contract on the Ethereum network.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Hardhat
- An Ethereum wallet with testnet funds
- `.env` file with your Alchemy HTTP URL and private key

### Setting Up the Project

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
   cd Week3/CrowdFunding
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` File**

   Create a `.env` file in the root directory with the following content:

   ```bash
   ALCHEMY_HTTP_URL=your_alchemy_http_url
   PRIVATE_KEY=your_private_key
   ```

### Executing the Program

1. **Compile the Contract**

   ```bash
   npx hardhat compile
   ```

2. **Deploy the Contract**

   You can deploy the contract to the Ethereum testnet by running the following Hardhat task:

   ```bash
   npx hardhat ignition deploy ignition/modules/deploy.ts --network sepolia --verify
   ```

### Deployment Details

- Wallet address for deployment: 0x40feacdeee6f017fA2Bc1a8FB38b393Cf9022d71

- CrowdFunding contract deployed to: 0x631f743d1066BD2DB5Eb75BC3ca96c576a20eEE1

- Successfully verified contract link:  [Etherscan Link](https://sepolia.etherscan.io/address/0x631f743d1066BD2DB5Eb75BC3ca96c576a20eEE1#code)

### Gas Optimizations

- **Custom Errors**: Used custom errors instead of require statements with string messages to reduce gas costs.
- **Mapping Contributions**: Contributions are stored in a mapping for O(1) access, which is more gas-efficient than iterating through arrays.
- **Struct Storage**: Structs are only declared in storage when necessary to avoid unnecessary gas costs associated with storage operations.
- **Boolean Default Value**: The `ended` boolean defaults to `false`, saving gas as it doesn't need to be explicitly set during campaign creation.

### Security Considerations

- **Re-entrancy Protection**: The contract updates state before making external calls, particularly in the `claimRefund` function, to prevent re-entrancy attacks.
- **Ownership and Access Control**: The `onlyOwner` modifier restricts critical functions like Ether withdrawal to the contract owner, enhancing security.
- **Safe Ether Transfers**: The contract uses low-level `call` for transferring Ether and checks for success, providing better gas management and security against re-entrancy.
- **Validation Before Actions**: The contract consistently validates conditions before performing state changes, reducing the risk of unexpected behavior or errors.
- **Deadline and Goal Checks**: Refunds are only allowed after the campaign deadline and only if the campaign has not ended, ensuring proper fund management.

### Authors

Abdulyekeen Lukman(Ibukun)