import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("SaveERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployToken() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    // Deploy the Web3CXI ERC20 token contract
    const erc20Token = await hre.ethers.getContractFactory("Web3CXI");
    const token = await erc20Token.deploy();

    return { token };
  }

  async function deploySaveERC20() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    // Deploy the Web3CXI token contract using the fixture
    const { token } = await loadFixture(deployToken);

    // Deploy the SaveERC20 contract, passing the token address to the constructor
    const saveERC20 = await hre.ethers.getContractFactory("SaveERC20");
    const saveErc20 = await saveERC20.deploy(token);

    return { saveErc20, owner, otherAccount, token };
  }

  // Test cases related to the deployment of the contract
  describe("Deployment", function () {
    // Check if the owner address is correctly set
    it("Should check if owner is correct", async function () {
      const { saveErc20, owner } = await loadFixture(deploySaveERC20);

      expect(await saveErc20.owner()).to.equal(owner);
    });

    // Check if the token address is correctly set in the SaveERC20 contract
    it("Should check if tokenAddress is correctly set", async function () {
      const { saveErc20, owner, token } = await loadFixture(deploySaveERC20);

      expect(await saveErc20.tokenAddress()).to.equal(token);
    });
  });

  // Test cases related to depositing tokens into the SaveERC20 contract
  describe("Deposit", function () {
    it("Should deposit successfully", async function () {
      const { saveErc20, owner, otherAccount, token } = await loadFixture(deploySaveERC20);

      // Transfer ERC20 tokens from the owner to another account
      const trfAmount = ethers.parseUnits("100", 18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      // Approve the SaveERC20 contract to spend tokens from the otherAccount
      await token.connect(otherAccount).approve(saveErc20, trfAmount);

      const otherAccountBalBefore = await token.balanceOf(otherAccount);

      const depositAmount = ethers.parseUnits("10", 18);

      // Deposit tokens from otherAccount into the SaveERC20 contract
      await saveErc20.connect(otherAccount).deposit(depositAmount);

      // Check the token balance of otherAccount after the deposit
      expect(await token.balanceOf(otherAccount)).to.equal(otherAccountBalBefore - depositAmount);

      // Check the internal balance of otherAccount within the SaveERC20 contract
      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount);
      
      // Check the total balance of tokens held by the SaveERC20 contract
      expect(await saveErc20.getContractBalance()).to.equal(depositAmount);
    });

    // Test that the DepositSuccessful event is emitted after a successful deposit
    it("Should emit an event after successful deposit", async function () {
      const { saveErc20, otherAccount, token } = await loadFixture(deploySaveERC20);

      const trfAmount = ethers.parseUnits("100", 18);
      await token.transfer(otherAccount, trfAmount);

      await token.connect(otherAccount).approve(saveErc20, trfAmount);

      const depositAmount = ethers.parseUnits("10", 18);

      // Expect the DepositSuccessful event to be emitted with the correct arguments
      await expect(saveErc20.connect(otherAccount).deposit(depositAmount))
        .to.emit(saveErc20, "DepositSuccessful")
        .withArgs(otherAccount.address, depositAmount);
    });

    // Test that depositing a zero amount of tokens will revert the transaction
    it("Should revert on zero deposit", async function () {
      const { saveErc20, otherAccount, token } = await loadFixture(deploySaveERC20);

      const depositAmount = ethers.parseUnits("0", 18);

      // Expect the transaction to revert with a custom error
      await expect(
        saveErc20.connect(otherAccount).deposit(depositAmount)
      ).to.be.revertedWithCustomError(saveErc20, "ZeroValueNotAllowed");
    });
  });

  // Test cases related to withdrawing tokens from the SaveERC20 contract
  describe("Withdraw", function () {
    it("Should deposit and withdraw successfully", async function () {
      const { saveErc20, owner, otherAccount, token } = await loadFixture(deploySaveERC20);

      // Transfer ERC20 tokens from owner to another account
      const trfAmount = ethers.parseUnits("100", 18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      // Approve the SaveERC20 contract to spend tokens from the otherAccount
      await token.connect(otherAccount).approve(saveErc20, trfAmount);

      const otherAccountBalBefore = await token.balanceOf(otherAccount);

      // Deposit tokens from otherAccount into the SaveERC20 contract
      const depositAmount = ethers.parseUnits("10", 18);
      await saveErc20.connect(otherAccount).deposit(depositAmount);

      // Check the token balance of otherAccount after the deposit
      expect(await token.balanceOf(otherAccount)).to.equal(otherAccountBalBefore - depositAmount);

      // Check the internal balance of otherAccount within the SaveERC20 contract
      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount);
      
      // Check the total balance of tokens held by the SaveERC20 contract
      expect(await saveErc20.getContractBalance()).to.equal(depositAmount);

      // Withdraw a portion of the tokens from the SaveERC20 contract
      const initBalBeforeWithdrawal = await token.balanceOf(otherAccount);
      const withdrawAmount = ethers.parseUnits("5", 18);
      await saveErc20.connect(otherAccount).withdraw(withdrawAmount);

      // Check the token balance of otherAccount after the withdrawal
      const balAfterWithdrawal = await token.balanceOf(otherAccount);

      // Check that the contract balance and user's internal balance are updated correctly
      expect(await saveErc20.getContractBalance()).to.equal(depositAmount - withdrawAmount);
      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount - withdrawAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(initBalBeforeWithdrawal + withdrawAmount);
    });
  });
});
