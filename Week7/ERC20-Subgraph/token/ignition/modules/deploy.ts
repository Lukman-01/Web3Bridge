import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseUnits } from "ethers";
import { ethers } from "hardhat";

const OGTokenModule = buildModule("OGTokenModule", (m) => {

  const initialSupply = ethers.parseUnits("100000", 18);

  const token = m.contract("OGToken",[initialSupply]);

  return {token};
});

export default OGTokenModule;

// deployed to: 0x81a81504cf6961164C6Ea740E6Da77f3d14CEd40
// https://sepolia.scrollscan.com/address/0x81a81504cf6961164C6Ea740E6Da77f3d14CEd40#code
