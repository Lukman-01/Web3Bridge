import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NftMarketPlaceModule = buildModule("NftMarketPlaceModule", (m) => {

  const nftMarket = m.contract("NFTMarketplace");

  return { nftMarket };
});

export default NftMarketPlaceModule;
