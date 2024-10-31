// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721Faucet.sol";

contract NFTLendingFaucet is Ownable(msg.sender) {
    IERC721 public nftContract;
    uint256 public tokenIdToMint;

    constructor(address _nftContract, uint256 _tokenIdToMint) {
        nftContract = ERC721Faucet(_nftContract);
        tokenIdToMint = _tokenIdToMint;
    }

    function mintNFT() public {
        nftContract.safeMint(msg.sender, tokenIdToMint);
    }

    function setNFTContract(address _nftContract) public onlyOwner {
        nftContract = IERC721(_nftContract);
    }

    function setTokenIdToMint(uint256 _tokenIdToMint) public onlyOwner {
        tokenIdToMint = _tokenIdToMint;
    }
}