// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibDiamond} from "../libraries/LibDiamond.sol";
import "./ERC721Facet.sol";

contract NFTStakeFacet {
    event NftStaked(address indexed onwer, address indexed nft, uint tokenId);
    event NftUnstaked(address indexed onwer, address indexed nft, uint tokenId);

    function stakeNft(address _nft, uint _tokenId) external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint nftValue = verifyNftValidity(_nft);

        if (nftValue == 0) revert LibDiamond.UnsupportedNFT();

        ERC721Facet(_nft).safeTransferFrom(msg.sender, address(this), _tokenId);

        LibDiamond.Position memory _position;

        if (_position.nft != address(0)) revert LibDiamond.AlreadyStaked();

        _position.nft = _nft;
        _position.nftValue = nftValue;
        _position.tokenId = _tokenId;

        ds.positions[msg.sender] = _position;

        emit NftStaked(msg.sender, _nft, _tokenId);
    }

    function unstakeNft() external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        LibDiamond.Position memory _position = ds.positions[msg.sender];

        address _nft = _position.nft;
        uint _tokenId = _position.tokenId;

        if (_nft == address(0)) revert LibDiamond.NoStake();
        if (_position.loanedAmount > 0) revert LibDiamond.CurrentlyOwing();

        _position.nft = address(0);
        _position.tokenId = 0;
        _position.nftValue = 0;
        _position.loanedAmount = 0;
        _position.timeLoaned = 0;

        ds.positions[msg.sender] = _position;

        ERC721Facet(_nft).safeTransferFrom(address(this), msg.sender, _tokenId);

        emit NftUnstaked(msg.sender, _nft, _tokenId);
    }

    function addSupportedNft(address _nft, uint _amount) internal {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        if (_nft == address(0)) revert LibDiamond.NoZeroAddress();
        if (msg.sender != ds.contractOwner) revert LibDiamond.NotDiamondOwner();

        ds.supportedNfts[_nft] = _amount;
    }

    function removeSupportedNft(address _nft) internal {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        if (_nft == address(0)) revert LibDiamond.NoZeroAddress();
        if (msg.sender != ds.contractOwner) revert LibDiamond.NotDiamondOwner();

        ds.supportedNfts[_nft] = 0;
    }

    function verifyNftValidity(address _nft) internal view returns (uint) {
        if (_nft == address(0)) revert LibDiamond.NoZeroAddress();

        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        return ds.supportedNfts[_nft];
    }
}
