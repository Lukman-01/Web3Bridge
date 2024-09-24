import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";
  
  describe("DeployBank", function () {
  
    async function deployBankAccount() {
    
      const [owner] = await hre.ethers.getSigners();
  
       const account = await hre.ethers.getContractFactory('BankAccount');
       const bankAccount = await account.deploy();
  
      return { bankAccount };
    }
  
    describe("CreateAccount", function () {
      it("Should check if user has registered", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc] = await hre.ethers.getSigners();
  
        expect((await bankAccount.users(acc)).hasRegistered).to.equal(false);
      });
  
      it("Should revert if user has registered", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc1, acc2] = await hre.ethers.getSigners();
  
        const name = 'Abdulyekeen Lukman';
        const age = 21;
        await bankAccount.connect(acc1).createAccount(name, age);
  
        await expect(bankAccount.connect(acc1).createAccount(name, age)).to.be.revertedWithCustomError(bankAccount, 'AlreadyRegistered');
      });
  
      it("Should confirm that an account was created successfully", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc1, acc2] = await hre.ethers.getSigners();
  
        const name = 'Abdulyekeen Lukman';
        const age = 21;
        await bankAccount.connect(acc1).createAccount(name, age);
  
  
        expect (await bankAccount.connect(acc1).userCount()).to.be.equal(1);
      });
    });
  
    describe("Deposit", function () {
      it("Should check if value passed is less than 1 ether", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc] = await hre.ethers.getSigners();
  
        const value = ethers.parseUnits("0.5", 18);
  
        await expect(bankAccount.connect(acc).deposit({value:value})).to.be.revertedWithCustomError(bankAccount, "DepositTooLow");
      });
  
      it("Should revert if user has registered", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc1, acc2] = await hre.ethers.getSigners();
  
        const name = 'Abdulyekeen Lukman';
        const age = 21;
        await bankAccount.connect(acc1).createAccount(name, age);
  
        const value = ethers.parseUnits("2", 18);
  
        await expect(bankAccount.connect(acc2).deposit({value:value})).to.be.revertedWithCustomError(bankAccount, 'NotRegistered');
      });
  
      it("Should confirm that the contract account was credited", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc1, acc2] = await hre.ethers.getSigners();
  
        const name = 'Abdulyekeen Lukman';
        const age = 21;
        await bankAccount.connect(acc1).createAccount(name, age);
  
        const value = ethers.parseUnits("2", 18);
        await bankAccount.connect(acc1).deposit({value:value});
  
        expect ((await bankAccount.connect(acc1).users(acc1)).balance).to.be.equal(value);
      });
  
      it("Should emmit event deposited successfully", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc1, acc2] = await hre.ethers.getSigners();
  
        const name = 'Abdulyekeen Lukman';
        const age = 21;
        await bankAccount.connect(acc1).createAccount(name, age);
  
        const value = ethers.parseUnits("2", 18);
        await bankAccount.connect(acc1).deposit({value:value});
  
        expect (await bankAccount.connect(acc1).deposit({value:value})).to.emit(bankAccount,"DepositMade")
        .withArgs(acc1,value);
      });
    });
  
    describe("Transfer", function () {
      it("Should check if user registered before transfer", async function () {
        const { bankAccount } = await loadFixture(deployBankAccount);
        const [acc1, acc2] = await hre.ethers.getSigners();
  
        const name = 'Abdulyekeen Lukman';
        const age = 21;
        await bankAccount.connect(acc1).createAccount(name, age);
  
        const value = ethers.parseUnits("2", 18);
        await bankAccount.connect(acc1).deposit({value:value});
  
        await expect(bankAccount.connect(acc2).transfer(acc1, value)).to.be.revertedWithCustomError(bankAccount,"NotRegistered");
      });
  
    });
  });