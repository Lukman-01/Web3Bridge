import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Deployment", function () {
  async function deployGUZToken() {

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("GUZToken");
    const gtoken = await Token.deploy();

    return { gtoken, owner, otherAccount };
  }

  async function deployW3BToken() {

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("W3BToken");
    const wtoken = await Token.deploy();

    return { wtoken, owner, otherAccount };
  }

  async function deployOrderedSwap() {

    const [owner, otherAccount] = await hre.ethers.getSigners();
    const {gtoken} = await loadFixture(deployGUZToken);
    const {wtoken} = await loadFixture(deployW3BToken);

    const Swap = await hre.ethers.getContractFactory("OrderedSwap");
    const swap = await Swap.deploy();

    return { gtoken, wtoken, swap, owner, otherAccount };
  }

  describe("Deployment", function () {
     
  });
});
