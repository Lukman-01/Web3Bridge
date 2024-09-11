import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { assert } from "ethers";

describe("Multisig", function () {

  async function deployToken() {
    const [owner] = await hre.ethers.getSigners();
    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy();
   
    return { token }
  }
  async function deployMultisigContract() {
    const quorum = 3;

    const [owner, otherAccount, otherAccount1, otherAccount2, otherAccount3, otherAccount4] = await hre.ethers.getSigners();

    const  {token} = await loadFixture(deployToken);
    const Multisig = await hre.ethers.getContractFactory("MultiSig");
    const multisig = await Multisig.deploy(quorum, [owner,  otherAccount, otherAccount1, otherAccount2, otherAccount3]);

    return { multisig, quorum, token, owner, otherAccount, otherAccount1, otherAccount2, otherAccount3, otherAccount4 };
  }



  describe("Deployment", function () {
    it("Should set the right quorum number", async function () {
      // const [owner] = await hre.ethers.getSigners();
      const { multisig, owner } = await loadFixture(deployMultisigContract);

      expect(await multisig.quorum()).to.equal(3);
    });
    it("Should set the rigth number of valid signers", async function () {
      //const [owner, otherAccount, otherAccount1, otherAccount2, otherAccount3] = await hre.ethers.getSigners();
      const { multisig } = await loadFixture(deployMultisigContract);

      expect(await multisig.noOfValidSigners()).to.equal(5);
    });

    it("Should set no of transactions to 0", async function () {
      //const [owner, otherAccount, otherAccount1, otherAccount2, otherAccount3] = await hre.ethers.getSigners();
      const { multisig } = await loadFixture(deployMultisigContract);

      expect(await multisig.txCount()).to.equal(0);
    });
  });

  describe("Tranfer", function () {
    it("Should revert if the sender is not a valid signer", async function () {

      const { multisig, token, otherAccount1, otherAccount4 } = await loadFixture(deployMultisigContract);
      const amount = hre.ethers.parseUnits("20", 18);

      expect(multisig.connect(otherAccount4).transfer(amount, otherAccount1.address, token)).to.be.revertedWith("invalid signer");
    });

    it("Should revert when zero amount is sent", async function () {
      const { multisig, token, otherAccount1, otherAccount3 } = await loadFixture(deployMultisigContract);
      const amount = hre.ethers.parseUnits("0", 18);

      expect(multisig.connect(otherAccount3).transfer(amount, otherAccount1.address, token)).to.revertedWith("can't send zero amount");
    });
    it("Should revert if receipient address is zero", async function () {
      const { multisig, token, otherAccount3 } = await loadFixture(deployMultisigContract);
      const amount = hre.ethers.parseUnits("0", 18);

      expect(multisig.connect(otherAccount3).transfer(amount, hre.ethers.ZeroAddress, token)).to.revertedWith("can't send zero amount");
    });
    it("Should revert if token address is zero", async function () {
      const { multisig, otherAccount2 } = await loadFixture(deployMultisigContract);
      const amount = hre.ethers.parseUnits("0", 18);

      expect(multisig.transfer(amount, otherAccount2.address, hre.ethers.ZeroAddress)).to.revertedWith("address zero found");
    });
    it("Should revert if token address balance is less than amount", async function () {
      const { multisig, token, otherAccount2} = await loadFixture(deployMultisigContract);
      const amountToTransfer = hre.ethers.parseUnits("500", 18)
      await token.transfer(multisig, amountToTransfer);
      expect(await token.balanceOf(multisig)).to.be.equal(amountToTransfer);
      

      const amount = hre.ethers.parseUnits("600", 18);

      await expect(multisig.transfer(amount, otherAccount2.address, token)).to.be.revertedWith("insufficient funds");
    });

    it("Should submit transaction at specified timestamp", async function () {
      const { multisig, token, otherAccount1, otherAccount2 } = await loadFixture(deployMultisigContract);
      const amount = hre.ethers.parseUnits("10", 18);

      const amountToTransfer = hre.ethers.parseUnits("500", 18)
      await token.transfer(multisig, amountToTransfer);
      expect(await token.balanceOf(multisig)).to.be.equal(amountToTransfer);
    
      // Get the current block's timestamp
      const blockNumber = await hre.ethers.provider.getBlockNumber();
      const currentBlock = await hre.ethers.provider.getBlock(blockNumber);
      const currentTimestamp = currentBlock?.timestamp;
    
      // Execute the transaction
      const tx = await multisig.transfer(amount, otherAccount2.address, token);
    
      // Wait for transaction to be mined and get the receipt
      const receipt = await tx.wait();
    
      // Get the block timestamp of the transaction
      const txBlock = await hre.ethers.provider.getBlock(receipt!.blockNumber);
      const txTimestamp = txBlock?.timestamp;
    
      // Now you can assert that the transaction was submitted at the current block timestamp
      expect(txTimestamp).to.be.equal(currentTimestamp! +1);
    });

    it("Should check if transaction is submitted correctly", async function () {
      const { multisig, token, otherAccount1, otherAccount2, otherAccount3 } = await loadFixture(deployMultisigContract);
      await token.transfer(multisig, hre.ethers.parseUnits("500", 18));
      const amount = hre.ethers.parseUnits("20", 18);

      await multisig.transfer(amount, otherAccount1.address, token);

      expect(await multisig.txCount()).to.equal(1);
    });
  });

  describe("Approve Trx", function () {
    it("Should revert if invalid trx id is passed", async function () {
      const { multisig, token, otherAccount1, otherAccount2, otherAccount3 } = await loadFixture(deployMultisigContract);
      await token.transfer(multisig, hre.ethers.parseUnits("500", 18));
      const amount = hre.ethers.parseUnits("20", 18);

      await multisig.transfer(amount, otherAccount1.address, token);
      await  expect(multisig.connect(otherAccount1).approveTx(2)).to.revertedWith("invalid tx id");
    });
    it("Should revert if token address balance is less than amount", async function () {
      const { multisig, token, otherAccount1, otherAccount2, otherAccount3 } = await loadFixture(deployMultisigContract);
      await token.transfer(multisig, hre.ethers.parseUnits("500", 18));
      const amount = hre.ethers.parseUnits("600", 18);
      // await multisig.transfer(amount, otherAccount1.address, token);

      expect(multisig.transfer(amount, otherAccount1.address, token)).to.revertedWith("insufficient funds");
    });

    it("Should check if transaction is submitted correctly", async function () {
      const { multisig, token, otherAccount1, otherAccount2, otherAccount3 } = await loadFixture(deployMultisigContract);
      await token.transfer(multisig, hre.ethers.parseUnits("500", 18));
      const amount = hre.ethers.parseUnits("20", 18);

      await multisig.transfer(amount, otherAccount1.address, token);

      await multisig.connect(otherAccount1).approveTx(1);
      await multisig.connect(otherAccount2).approveTx(1);

      await  expect(multisig.connect(otherAccount3).approveTx(1)).to.be.revertedWith("transaction already completed");
      
    });

    it("Should check if noOfApproval is less than quorum", async function () {
      const { multisig, token, otherAccount1, otherAccount2, otherAccount3 } = await loadFixture(deployMultisigContract);
      await token.transfer(multisig, hre.ethers.parseUnits("500", 18));
      const amount = hre.ethers.parseUnits("20", 18);

      await multisig.transfer(amount, otherAccount1.address, token);

      await multisig.connect(otherAccount1).approveTx(1);

      expect((await multisig.getOneTransaction(1)).noOfApproval).to.be.equal(2);
      
    });

    it("shoul revert if not a valid signer", async function () {
      const {multisig, token, otherAccount,otherAccount4} = await loadFixture(deployMultisigContract);
      await token.transfer(multisig, hre.ethers.parseUnits("500", 18));
      const amount = hre.ethers.parseUnits("20", 18);

      await multisig.transfer(amount, otherAccount.address, token);


      await expect(multisig.connect(otherAccount4).approveTx(1)).to.be.revertedWith("not a valid signer");
    })
  });
});