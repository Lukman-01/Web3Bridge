const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const merkle_root_hash =  " ";
const token_address = "0xBF7F035328bA48D9C77F31A8e5f6816d0E92dfC1";

module.exports = buildModule("AirdropContractModule", (m) => {

  const airdropContract = m.contract("AirdropContract", [token_address, merkle_root_hash]);

  return { airdropContract };
});