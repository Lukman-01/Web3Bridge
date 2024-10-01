import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const ALCHEMY_HTTP_URL = process.env.ALCHEMY_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    sepolia: {
      url: ALCHEMY_HTTP_URL,
      accounts: [PRIVATE_KEY!],
    },
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY!,
    },
  },
};

export default config;
