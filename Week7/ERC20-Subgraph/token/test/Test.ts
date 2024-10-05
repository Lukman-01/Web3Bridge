import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Lock", function () {
    async function deployToken() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("OGToken");
    const token = await Token.deploy(ethers.parseUnits("100000", 18));

    return { token, owner, otherAccount };
  }

  describe("Deployment", function () {
     
  });
});
