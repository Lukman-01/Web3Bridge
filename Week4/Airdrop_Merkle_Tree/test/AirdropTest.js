const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("MerkleAirdropHe", function () {
  // Declaring variables to hold contract instances, addresses, and data
  let merkleAirdrop, token, owner, addr1, addr2, addr3;
  let merkleRoot, merkleTree;
  let users = [];

  // Before running the tests, deploy contracts and set up the Merkle Tree
  before(async function () {
    // Get the signers from Hardhat
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a mock ERC20 token contract
    const erc20Token = await ethers.getContractFactory("AirdropToken");
    token = await erc20Token.deploy();

    // Initialize users with their respective addresses and airdrop amounts
    users = [
      { address: addr1.address, amount: 100 },
      { address: addr2.address, amount: 200 },
      { address: addr3.address, amount: 300 },
    ];

    // Create leaves for the Merkle Tree by hashing each user's address and amount
    const leaves = users.map((user) =>
      keccak256(
        ethers.solidityPacked(
          ["address", "uint256"],
          [user.address, user.amount]
        )
      )
    );
    
    // Create a Merkle Tree using the leaves
    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    
    // Get the Merkle Root from the Merkle Tree
    merkleRoot = merkleTree.getRoot().toString("hex");

    // Deploy the MerkleAirdrop contract with the token and the Merkle Root
    const MerkleAirdropFactory = await ethers.getContractFactory(
      "MerkleAirdrop"
    );
    merkleAirdrop = await MerkleAirdropFactory.deploy(token, `0x${merkleRoot}`);

    // Transfer tokens from the owner to the MerkleAirdrop contract
    await token.transfer(merkleAirdrop, 1000);
  });

  // Test that the owner can deposit tokens into the airdrop contract
  it("Should allow the owner to deposit tokens into the contract", async function () {
    // Approve the contract to spend the owner's tokens
    await token.approve(merkleAirdrop, 500);
    
    // Deposit 500 tokens into the contract and expect the "DepositIntoContractSuccessful" event
    await expect(merkleAirdrop.depositIntoContract(500))
      .to.emit(merkleAirdrop, "DepositIntoContractSuccessful")
      .withArgs(owner.address, 500);
  });

  // Test that eligible users can claim their tokens from the airdrop
  it("Should allow eligible users to claim their tokens", async function () {
    for (let user of users) {
      // For each user, create a leaf from their address and amount
      const leaf = keccak256(
        ethers.solidityPacked(
          ["address", "uint256"],
          [user.address, user.amount]
        )
      );
      
      // Generate a Merkle proof for the user's leaf
      const proof = merkleTree.getHexProof(leaf);

      // Claim reward by connecting with the respective user address and expect "UserClaimedTokens" event
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

  // Test that users cannot claim their tokens more than once
  it("Should not allow a user to claim tokens more than once", async function () {
    const user = users[0]; // Choosing the first user
    const leaf = keccak256(
      ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
    );
    const proof = merkleTree.getHexProof(leaf);

    // Try to claim again and expect a revert with "UserAlreadyClaimed" error
    await expect(
      merkleAirdrop.connect(addr1).claimReward(user.amount, proof)
    ).to.be.revertedWithCustomError(merkleAirdrop, "UserAlreadyClaimed");
  });

  // Test that the contract reverts if the user provides an invalid proof
  it("Should revert if the user provides an invalid proof", async function () {
    // Generate an invalid proof by hashing some invalid data
    const invalidProof = merkleTree.getHexProof(keccak256("invalid_data"));
    
    // Try to claim using the invalid proof and expect a revert with "SorryYouAreNotEligible" error
    await expect(
      merkleAirdrop.connect(addr3).claimReward(300, invalidProof)
    ).to.be.revertedWithCustomError(merkleAirdrop, "SorryYouAreNotEligible");
  });
});
