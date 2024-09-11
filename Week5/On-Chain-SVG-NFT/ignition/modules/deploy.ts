import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OnChainNFTModule = buildModule("OnChainNFTModule", (m) => {

  const onChainNFT = m.contract("OnChainNFT");

  return { onChainNFT };
});

export default OnChainNFTModule;
