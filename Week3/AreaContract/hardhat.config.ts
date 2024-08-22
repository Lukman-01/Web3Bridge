import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_HTTP_URL =  vars.get("ALCHEMY_HTTP_URL");
const PRIVATE_KEY =  vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: ALCHEMY_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
