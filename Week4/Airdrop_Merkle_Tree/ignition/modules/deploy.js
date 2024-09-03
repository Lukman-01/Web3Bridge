const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const merkle_root_hash =  "0x8f274e5f685051d5e320a9b9de911f3d3d5388eb6dfbb1ace1f685cc03ef9da4";
const token_address = "0xBF7F035328bA48D9C77F31A8e5f6816d0E92dfC1";

module.exports = buildModule("AirdropContractModule", (m) => {

  const airdropContract = m.contract("AirdropContract", [token_address, merkle_root_hash]);

  return { airdropContract };
});