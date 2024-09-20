import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("NFTMarketplace", function () {

  async function deployNftMarketPlace() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const NftMarketPlace = await hre.ethers.getContractFactory("NFTMarketplace");
    const nftMarketPlace = await NftMarketPlace.deploy();
    
    return { nftMarketPlace, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy the contract and set the correct owner", async function () {
      const { nftMarketPlace, owner } = await loadFixture(deployNftMarketPlace);

      expect(await nftMarketPlace.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow the owner to mint an NFT", async function () {
      const { nftMarketPlace, owner, otherAccount } = await loadFixture(deployNftMarketPlace);

      // Mint an NFT to otherAccount
      await expect(nftMarketPlace.mint(otherAccount.address))
        .to.emit(nftMarketPlace, "Transfer")
        .withArgs(hre.ethers.AddressZero, otherAccount.address, 1);

      expect(await nftMarketPlace.ownerOf(1)).to.equal(otherAccount.address);
    });

    it("Should fail to mint if called by a non-owner", async function () {
      const { nftMarketPlace, otherAccount } = await loadFixture(deployNftMarketPlace);

      await expect(
        nftMarketPlace.connect(otherAccount).mint(otherAccount.address)
      ).to.be.revertedWith("Caller is not the owner");
    });
  });

  describe("Listing for Sale", function () {
    it("Should allow the owner to list an NFT for sale", async function () {
      const { nftMarketPlace, owner, otherAccount } = await loadFixture(deployNftMarketPlace);

      await nftMarketPlace.mint(otherAccount.address);

      await expect(
        nftMarketPlace.connect(otherAccount).listForSale(1, hre.ethers.parseEther("1"))
      ).to.emit(nftMarketPlace, "Transfer");

      const listing = await nftMarketPlace.listings(1);
      expect(listing.isForSale).to.be.true;
      expect(listing.price).to.equal(hre.ethers.parseEther("1"));
    });

    it("Should fail to list if not the token owner", async function () {
      const { nftMarketPlace, owner, otherAccount } = await loadFixture(deployNftMarketPlace);

      await nftMarketPlace.mint(owner.address);

      await expect(
        nftMarketPlace.connect(otherAccount).listForSale(1, hre.ethers.parseEther("1"))
      ).to.be.revertedWith("Not the token owner");
    });
  });

  describe("Buying NFTs", function () {
    it("Should allow someone to buy a listed NFT", async function () {
      const { nftMarketPlace, owner, otherAccount } = await loadFixture(deployNftMarketPlace);

      await nftMarketPlace.mint(otherAccount.address);

      await nftMarketPlace.connect(otherAccount).listForSale(1, hre.ethers.parseEther("1"));

      await expect(
        nftMarketPlace.connect(owner).buy(1, { value: hre.ethers.parseEther("1") })
      ).to.emit(nftMarketPlace, "Transfer");

      expect(await nftMarketPlace.ownerOf(1)).to.equal(owner.address);
    });

    it("Should fail if the buyer sends insufficient funds", async function () {
      const { nftMarketPlace, owner, otherAccount } = await loadFixture(deployNftMarketPlace);

      await nftMarketPlace.mint(otherAccount.address);

      await nftMarketPlace.connect(otherAccount).listForSale(1, hre.ethers.parseEther("1"));

      await expect(
        nftMarketPlace.connect(owner).buy(1, { value: hre.ethers.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient funds");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow the contract owner to withdraw funds", async function () {
      const { nftMarketPlace, owner, otherAccount } = await loadFixture(deployNftMarketPlace);

      await nftMarketPlace.mint(otherAccount.address);

      await nftMarketPlace.connect(otherAccount).listForSale(1, hre.ethers.parseEther("1"));

      await nftMarketPlace.connect(owner).buy(1, { value: hre.ethers.parseEther("1") });

      const contractBalanceBefore = await hre.ethers.provider.getBalance(nftMarketPlace);
      expect(contractBalanceBefore).to.equal(hre.ethers.parseEther("1"));

      await expect(nftMarketPlace.withdraw())
        .to.changeEtherBalances([owner, nftMarketPlace], [hre.ethers.parseEther("1"), hre.ethers.parseEther("-1")]);
    });

    it("Should fail if a non-owner tries to withdraw", async function () {
      const { nftMarketPlace, otherAccount } = await loadFixture(deployNftMarketPlace);

      await expect(
        nftMarketPlace.connect(otherAccount).withdraw()
      ).to.be.revertedWith("Caller is not the owner");
    });
  });
});
