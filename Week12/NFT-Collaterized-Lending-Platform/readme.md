# NFI-Collateralized-Lending-Platform

The **NFI-Collateralized-Lending-Platform** is a decentralized platform built with the **Diamond Standard (EIP-2535)**, allowing users to leverage Non-Fungible Tokens (NFTs) as collateral for loans. This architecture enhances modularity and scalability, enabling flexible loan and liquidation processes through separate facets. Built with **Foundry**, the platform is highly efficient for development and testing.

## Features
1. **NFT Staking**: Users can choose eligible NFTs to stake as collateral.
2. **NFT Valuation and Borrowing Limit**: The platform evaluates staked NFTs to determine a borrowing limit.
3. **Loan Requests and Disbursement**: Users can request a loan up to their limit, and funds are sent directly to their wallet.
4. **Interest Calculation and Liquidation**: Interest and loan duration are set, with the platform liquidating the NFT if the user defaults.
5. **Contract Balance Management**: Efficient tracking and management of funds within the platform’s contract balance.

## Getting Started

To interact with the **NFI-Collateralized-Lending-Platform**, users need:
1. An Ethereum-compatible wallet (e.g., MetaMask).
2. NFTs eligible for staking on the platform.
3. Tokens for transaction fees on the Ethereum network.

---

## Installation

### Prerequisites
Ensure [Foundry](https://github.com/foundry-rs/foundry) is installed for deploying and testing the contracts.

1. Clone the repository:
    ```bash
    git clone https://github.com/Lukman-01/Web3Bridge.git
    cd Week12/NFT-Collateralized-Lending-Platform
    ```

2. Install dependencies (if using additional libraries):
    ```bash
    forge install
    ```

3. Configure `.env` file with network, wallet, and other configuration details.

### Running Tests
Use Foundry’s `forge` to run tests on the platform:
```bash
forge test
```