const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("MerkleAirdropHe", function () {
  let merkleAirdrop, token, owner, addr1, addr2, addr3;
  let merkleRoot, merkleTree;
  let users = [];

  before(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a mock ERC20 token
    const erc20Token = await ethers.getContractFactory("Web3CXI");
    token = await erc20Token.deploy();

    // Create leaves for Merkle Tree
    users = [
      { address: addr1.address, amount: 100 },
      { address: addr2.address, amount: 200 },
      { address: addr3.address, amount: 300 },
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
      "MerkleAirdrop"
    );
    merkleAirdrop = await MerkleAirdropFactory.deploy(token, `0x${merkleRoot}`);

    // Transfer tokens to contract
    await token.transfer(merkleAirdrop, 1000);
  });

  it("Should allow the owner to deposit tokens into the contract", async function () {
    await token.connect(owner).approve(merkleAirdrop, 500);
    await expect(merkleAirdrop.depositIntoContract(500))
      .to.emit(merkleAirdrop, "DepositIntoContractSuccessful")
      .withArgs(owner.address, 500);
  });

  it("Should allow eligible users to claim their tokens", async function () {
    for (let user of users) {
      const leaf = keccak256(
        ethers.solidityPacked(
          ["address", "uint256"],
          [user.address, user.amount]
        )
      );
      const proof = merkleTree.getHexProof(leaf);

      await expect(
        merkleAirdrop
          .connect(
            user.address === addr1.address
              ? addr1
              : user.address === addr2.address
              ? addr2
              : addr3
          )
          .claimReward(user.amount, proof)
      ).to.emit(merkleAirdrop, "UserClaimedTokens");
    }
  });

  it("Should not allow a user to claim tokens more than once", async function () {
    const user = users[0];
    const leaf = keccak256(
      ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
    );
    const proof = merkleTree.getHexProof(leaf);

    await expect(
      merkleAirdrop.connect(addr1).claimReward(user.amount, proof)
    ).to.be.revertedWithCustomError(merkleAirdrop, "UserAlreadyClaimed");
  });

  it("Should revert if the user provides an invalid proof", async function () {
    const invalidProof = merkleTree.getHexProof(keccak256("invalid_data"));
    await expect(
      merkleAirdrop.connect(addr3).claimReward(300, invalidProof)
    ).to.be.revertedWithCustomError(merkleAirdrop, "SorryYouAreNotEligible");
  });
});