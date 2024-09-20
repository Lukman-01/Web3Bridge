// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NftMarketPlaceModule = buildModule("NftMarketPlaceModule", (m) => {

  const nftMarket = m.contract("NftMarketPlace");

  return { nftMarket };
});

export default NftMarketPlaceModule;
