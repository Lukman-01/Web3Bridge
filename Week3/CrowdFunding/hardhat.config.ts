import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_HTTP_URL =  vars.get("ALCHEMY_HTTP_URL");
const PRIVATE_KEY =  vars.get("PRIVATE_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks:{
    sepolia:{
      url: ALCHEMY_HTTP_URL,
      accounts: [PRIVATE_KEY],
    }
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
};

export default config;