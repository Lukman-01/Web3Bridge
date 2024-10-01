import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LockModule = buildModule("LockModule", (m) => {

  const token = m.contract("AirdropToken");
  const merkleRootHash = "0x8f274e5f685051d5e320a9b9de911f3d3d5388eb6dfbb1ace1f685cc03ef9da4";
  const airdrop = m.contract("NFTAirdrop", [token, merkleRootHash]);

  return { token, airdrop };
});

export default LockModule;
