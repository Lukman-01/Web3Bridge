import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("OrderedSwap", function () {

  // Fixture to deploy GUZToken
  async function deployGUZToken() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Token = await hre.ethers.getContractFactory("GUZToken");
    const gtoken = await Token.deploy();
    return { gtoken, owner, otherAccount };
  }

  // Fixture to deploy W3BToken
  async function deployW3BToken() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Token = await hre.ethers.getContractFactory("W3BToken");
    const wtoken = await Token.deploy();
    return { wtoken, owner, otherAccount };
  }

  // Fixture to deploy the OrderedSwap contract and two tokens
  async function deployOrderedSwap() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const { gtoken } = await loadFixture(deployGUZToken);
    const { wtoken } = await loadFixture(deployW3BToken);

    const Swap = await hre.ethers.getContractFactory("OrderedSwap");
    const swap = await Swap.deploy();
    
    return { gtoken, wtoken, swap, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy GUZ and W3B tokens and the OrderedSwap contract", async function () {
      const { gtoken, wtoken, swap } = await loadFixture(deployOrderedSwap);

      expect(gtoken.address).to.properAddress;
      expect(wtoken.address).to.properAddress;
      expect(swap.address).to.properAddress;
    });
  });

  describe("Create Order", function () {
    it("Should allow a user to create an order", async function () {
      const { gtoken, swap, owner } = await loadFixture(deployOrderedSwap);

      // Approve tokens for the swap contract
      const amountDeposited = hre.ethers.parseUnits("100", 18);
      await gtoken.approve(swap.address, amountDeposited);

      // Create an order (100 GUZ tokens in exchange for 20 W3B tokens)
      await expect(swap.createOrder(gtoken.address, amountDeposited, hre.ethers.constants.AddressZero, 0)) // Example placeholder, should replace AddressZero and amount
        .to.emit(swap, "OrderCreated");
    });
  });

  describe("Fill Order", function () {
    it("Should allow a user to fill an order", async function () {
      const { gtoken, wtoken, swap, owner, otherAccount } = await loadFixture(deployOrderedSwap);

      // Owner creates an order
      const amountDeposited = hre.ethers.parseUnits("100", 18);
      const amountExpected = hre.ethers.parseUnits("20", 18);

      await gtoken.approve(swap.address, amountDeposited);
      await swap.createOrder(gtoken.address, amountDeposited, wtoken.address, amountExpected);

      // Other account approves W3B tokens to swap contract and fills the order
      await wtoken.transfer(otherAccount.address, amountExpected); // Transfer tokens to otherAccount
      await wtoken.connect(otherAccount).approve(swap.address, amountExpected);
      await expect(swap.connect(otherAccount).fillOrder(1))
        .to.emit(swap, "OrderFilled")
        .withArgs(otherAccount.address, 1);
    });
  });

  describe("Cancel Order", function () {
    it("Should allow the owner to cancel an order", async function () {
      const { gtoken, swap, owner } = await loadFixture(deployOrderedSwap);

      // Owner creates an order
      const amountDeposited = hre.ethers.parseUnits("100", 18);
      const amountExpected = hre.ethers.parseUnits("20", 18);

      await gtoken.approve(swap.address, amountDeposited);
      await swap.createOrder(gtoken.address, amountDeposited, hre.ethers.constants.AddressZero, amountExpected); // Modify as per requirements

      // Owner cancels the order
      await expect(swap.cancelOrder(1))
        .to.emit(swap, "OrderCancelled")
        .withArgs(1);
    });

    it("Should revert if a non-owner tries to cancel an order", async function () {
      const { gtoken, swap, owner, otherAccount } = await loadFixture(deployOrderedSwap);

      // Owner creates an order
      const amountDeposited = hre.ethers.parseUnits("100", 18);
      await gtoken.approve(swap.address, amountDeposited);
      await swap.createOrder(gtoken.address, amountDeposited, hre.ethers.constants.AddressZero, 0);

      // Non-owner tries to cancel the order
      await expect(swap.connect(otherAccount).cancelOrder(1))
        .to.be.revertedWithCustomError(swap, "OnlyOwnerCanCancelOrder");
    });
  });
});
