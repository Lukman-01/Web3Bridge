import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("NftMarketPlace", function () {
   
  async function deployNftMarketPlace() {
     
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const NftMarketPlace = await hre.ethers.getContractFactory("NftMarketPlace");
    const nftMarketPlace = await NftMarketPlace.deploy();

    return { nftMarketPlace, owner, otherAccount };
  }

  describe("Deployment", function () {
     
  });
});
