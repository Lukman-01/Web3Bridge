import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Deployment", function () {
  async function deployToken() {

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy();

    return { token, owner, otherAccount };
  }

  async function deployOrderedSwap() {

    const [owner, otherAccount] = await hre.ethers.getSigners();
    const {token} = await loadFixture(deployToken);

    const Swap = await hre.ethers.getContractFactory("OrderedSwap");
    const swap = await Swap.deploy();

    return { token, swap, owner, otherAccount };
  }

  describe("Deployment", function () {
     
  });
});
