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

    const erc20Token = await hre.ethers.getContractFactory("Web3CXI");
    const token = await erc20Token.deploy();

    return { token };
  }

  async function deploySaveERC20() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const { token } = await loadFixture(deployToken)

    const saveERC20 = await hre.ethers.getContractFactory("SaveERC20");
    const saveErc20 = await saveERC20.deploy(token);

    return { saveErc20, owner, otherAccount, token };
  }

  describe("Deployment", function () {
    it("Should check if owner is correct", async function () {
      const { saveErc20, owner } = await loadFixture(deploySaveERC20);

      expect(await saveErc20.owner()).to.equal(owner);
    });

    it("Should check if tokenAddress is correctly set", async function () {
      const { saveErc20, owner, token } = await loadFixture(deploySaveERC20);

      expect(await saveErc20.tokenAddress()).to.equal(token);
    });
  });

  describe("Deposit", function () {
    it("Should deposit successfully", async function () {
      const { saveErc20, owner, otherAccount, token } = await loadFixture(deploySaveERC20);

      // Transfer erc20 tokens from the owner to otherAccount
      const trfAmount = ethers.parseUnits("100", 18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      // using otherAccount to approve the SaveErc20 contract to spend token
      await token.connect(otherAccount).approve(saveErc20, trfAmount);

      const otherAccountBalBefore = await token.balanceOf(otherAccount);

      const depositAmount = ethers.parseUnits("10", 18);

      // Using the otherAccount to call the deposit function
      await saveErc20.connect(otherAccount).deposit(depositAmount);

      expect(await token.balanceOf(otherAccount)).to.equal(otherAccountBalBefore - depositAmount);

      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount);
      expect(await saveErc20.getContractBalance()).to.equal(depositAmount);
    });

    it("Should emit an event after successful deposit", async function () {
      const { saveErc20, otherAccount, token } = await loadFixture(deploySaveERC20);

      const trfAmount = ethers.parseUnits("100", 18);
      await token.transfer(otherAccount, trfAmount);

      await token.connect(otherAccount).approve(saveErc20, trfAmount);

      const depositAmount = ethers.parseUnits("10", 18);

      await expect(saveErc20.connect(otherAccount).deposit(depositAmount))
        .to.emit(saveErc20, "DepositSuccessful")
        .withArgs(otherAccount.address, depositAmount);
    });


    it("Should revert on zero deposit", async function () {
      const { saveErc20, otherAccount, token } = await loadFixture(deploySaveERC20);

      const depositAmount = ethers.parseUnits("0", 18);

      await expect(
        saveErc20.connect(otherAccount).deposit(depositAmount)
      ).to.be.revertedWithCustomError(saveErc20, "ZeroValueNotAllowed");
    });
  });


  describe("Withdraw", function () {
    it("Should deposit successfully", async function () {
      const { saveErc20, owner, otherAccount, token } = await loadFixture(deploySaveERC20);

      // Transfer ERC20 token from owner to otherAccount
      const trfAmount = ethers.parseUnits("100", 18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      // otherAccount approves contract address to spend some tokens
      await token.connect(otherAccount).approve(saveErc20, trfAmount);

      const otherAccountBalBefore = await token.balanceOf(otherAccount);

      // otherAccount deposits into SaveERC20 contract
      const depositAmount = ethers.parseUnits("10", 18);

      await saveErc20.connect(otherAccount).deposit(depositAmount);

      expect(await token.balanceOf(otherAccount)).to.equal(otherAccountBalBefore - depositAmount);

      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount);
      expect(await saveErc20.getContractBalance()).to.equal(depositAmount);

      // otherAccount withdraw from contract
      const initBalBeforeWithdrawal = await token.balanceOf(otherAccount);
      const withdrawAmount = ethers.parseUnits("5", 18);

      await saveErc20.connect(otherAccount).withdraw(withdrawAmount);

      const balAfterWithdrawal = await token.balanceOf(otherAccount);

      expect(await saveErc20.getContractBalance()).to.equal(depositAmount - withdrawAmount);

      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount - withdrawAmount);
      
      expect(await token.balanceOf(otherAccount)).to.equal(initBalBeforeWithdrawal + withdrawAmount);
    });
  });
});
