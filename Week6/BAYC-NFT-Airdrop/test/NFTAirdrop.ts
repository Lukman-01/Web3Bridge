import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import helpers from "@nomicfoundation/hardhat-network-helpers";
import { setBalance, impersonateAccount } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("MerkleAirdropCoreFuncsTest", function () {
  let merkleAirdrop: any,
    token: any,
    owner: any,
    addr1 = '0xe2A83b15FC300D8457eB9E176f98d92a8FF40a49',
    addr2 = '0x6b4DF334368b09f87B3722449703060EEf284126',
    addr3 = '0x6b4DF334368b09f87B3722449703060EEf284126',
    addrWithoutNFT: any;

  let merkleRoot, merkleTree: any;
  let users: any[] = [];

  before(async function () {
    [owner, addrWithoutNFT] = await ethers.getSigners();

    await setBalance(addr1, ethers.parseEther("30"));
    await setBalance(addr2, ethers.parseEther("30"));
    await setBalance(addr3, ethers.parseEther("30"));

    // Deploy a mock ERC20 token
    const erc20Token = await ethers.getContractFactory("AirdropToken");
    token = await erc20Token.deploy();

    // Create leaves for Merkle Tree
    users = [
      { address: addr1, amount: 30000 },
      { address: addr2, amount: 10000 },
      { address: addr3, amount: 5000 },
      { address: addrWithoutNFT.address, amount: 5000 },
    ];

    const leaves = users.map((user) =>
      keccak256(
        ethers.solidityPacked(
          ["address", "uint256"],
          [user.address, user.amount]
        )
      )
    );
    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    merkleRoot = merkleTree.getRoot().toString("hex");

    // Deploy MerkleAirdrop contract
    const MerkleAirdropFactory = await ethers.getContractFactory(
      "NFTAirdrop"
    );
    merkleAirdrop = await MerkleAirdropFactory.deploy(token, `0x${merkleRoot}`);

    // Transfer tokens to contract
    await token.transfer(merkleAirdrop, 100000);
  });

  it("Should allow the owner to deposit tokens into the contract", async function () {
    await token.connect(owner).approve(merkleAirdrop, 500);
    await expect(merkleAirdrop.depositIntoContract(500))
      .to.emit(merkleAirdrop, "DepositIntoContractSuccessful")
      .withArgs(owner.address, 500);
  });

  it("Should allow eligible users with bayc nft to claim their tokens", async function () {
    const leaf = keccak256(
      ethers.solidityPacked(
        ["address", "uint256"],
        [addr1, 30000]
      )
    );
    const proof = merkleTree.getHexProof(leaf);

    await impersonateAccount(addr1);
    const impersonatedSigner = await ethers.getSigner(addr1);

    await expect(
      merkleAirdrop
        .connect(impersonatedSigner)
        .claimReward(30000, proof)
    ).to.emit(merkleAirdrop, "UserClaimedTokens");
  });

  it("Should not allow a user without the BAYC NFT to claim tokens", async function () {
    const user = users[users.length-1];
    const leaf = keccak256(
      ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
    );
    const proof = merkleTree.getHexProof(leaf);

    await expect(
      merkleAirdrop.connect(addrWithoutNFT).claimReward(user.amount, proof)
    ).to.be.revertedWithCustomError(merkleAirdrop, "YouDontHaveBAYCNFT");
  });

  it("Should not allow a user to claim tokens more than once", async function () {
    const user = users[0];
    const leaf = keccak256(
      ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
    );
    const proof = merkleTree.getHexProof(leaf);

    await impersonateAccount(addr1);
    const impersonatedSigner = await ethers.getSigner(addr1);

    await expect(
      merkleAirdrop.connect(impersonatedSigner).claimReward(user.amount, proof)
    ).to.be.revertedWithCustomError(merkleAirdrop, "UserAlreadyClaimed");
  });

  it("Should revert if the user provides an invalid proof", async function () {
    const invalidProof = merkleTree.getHexProof(keccak256("invalid_data"));

    await impersonateAccount(addr2);
    const impersonatedSigner = await ethers.getSigner(addr2);

    await expect(
      merkleAirdrop.connect(impersonatedSigner).claimReward(300, invalidProof)
    ).to.be.revertedWithCustomError(merkleAirdrop, "SorryYouAreNotEligible");
  });
});