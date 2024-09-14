## Uniswap Mainnet Interaction Script with Hardhat and Ethers.js

This repository contains scripts that interact with Uniswap V2 on the Ethereum network using Hardhat, Ethers.js, and Alchemy. The scripts allow you to add and remove liquidity, as well as swap tokens between USDC and DAI, on a forked Ethereum mainnet for testing purposes.

### Prerequisites

To run this project, you'll need to install the following:

- [Node.js](https://nodejs.org/en/)
- [Hardhat](https://hardhat.org/getting-started/)
- [Alchemy API Key](https://www.alchemy.com/)
- A USDC token holder address with sufficient tokens to test liquidity provision and swaps.

### Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Lukman-01/Web3Bridge.git
   cd Week5/Uniswap-Mainnet-Forking
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:

   ```bash
   ALCHEMY_MAINNET_API_KEY_URL=your_alchemy_url
   ACCOUNT_PRIVATE_KEY=your_private_key
   ```

   - Replace `your_alchemy_url` with your Alchemy Mainnet URL (can be found in your Alchemy dashboard).
   - Replace `your_private_key` with the private key of an Ethereum account with sufficient ETH for gas fees.

### Scripts

#### 1. **Add and Remove Liquidity Script**

This script adds and removes liquidity from the USDC/DAI liquidity pool on Uniswap V2.

- **Liquidity Addition:**
  - The script first impersonates a USDC token holder.
  - It then approves and adds liquidity to the Uniswap V2 pool for USDC and DAI.
  - The token balances before and after adding liquidity are logged.

- **Liquidity Removal:**
  - The script checks for sufficient liquidity tokens, approves the Uniswap router, and removes the liquidity.
  - It then logs the USDC and DAI token balances after the liquidity is removed.

To run the script:

```bash
npx hardhat run scripts/add_remove_liquidity.js
```

#### 2. **Token Swap Script**

This script swaps USDC for DAI on Uniswap V2 using the `swapTokensForExactTokens` function.

- The script impersonates a USDC token holder.
- It approves the router contract to spend USDC tokens.
- It then swaps a specified amount of USDC for DAI, with a maximum allowable USDC input.
- Token balances before and after the swap are logged.

To run the script:

```bash
npx hardhat run scripts/swap_tokens.js
```

### Configuration

#### Hardhat Configuration

The Hardhat configuration is defined in `hardhat.config.ts` and includes the following:

- **Solidity Compiler:** The project is set to compile Solidity code using version `0.8.24`.
- **Network Forking:** The `hardhat` network is set to fork the Ethereum mainnet using the Alchemy API. This allows testing with mainnet data.

```js
// hardhat.config.ts
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MAINNET_API_KEY_URL,
      }
    }
  },
  lockGasLimit: 200000000000,
  gasPrice: 10000000000,
};
```

### Key Variables in Scripts

- **`ROUTER_ADDRESS`**: The address of the Uniswap V2 router contract.
- **`USDC` and `DAI`**: Token addresses for USDC and DAI on Ethereum.
- **`TOKEN_HOLDER`**: The Ethereum address of a USDC token holder used for impersonation.
- **`amountADesired` and `amountBDesired`**: Desired amounts of USDC and DAI for liquidity.
- **`amountOut` and `amountInMax`**: Desired output token and maximum input token amounts for swaps.

### Important Notes

- **Gas Fees**: Since this uses a forked mainnet, you will not be paying actual gas fees. However, if you want to deploy or test on a live network, ensure you have enough ETH in your account.
- **Impersonating Accounts**: Impersonation is enabled via the Hardhat helpers to simulate ownership of accounts with tokens, which is useful for testing without needing real funds.

### Running Tests

To test the functionality locally using a forked Ethereum mainnet:

1. Start a Hardhat node:

   ```bash
   npx hardhat node
   ```

2. Run the liquidity or swap script:

   ```bash
   npx hardhat run scripts/<script_name>.js --network localhost
   ```