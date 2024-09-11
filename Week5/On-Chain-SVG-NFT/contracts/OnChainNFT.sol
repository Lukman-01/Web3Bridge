// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OnChainNFT is ERC721URIStorage, Ownable {
    event Minted(uint256 tokenId);

    uint256 private _tokenIds;

    constructor() ERC721("WEB3CXI ON-CHAIN", "WOC") Ownable(msg.sender) {}

    /* Converts an SVG to Base64 string */
    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(svg));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    /* Generates a tokenURI using Base64 string as the image */
    function formatTokenURI(string memory imageURI)
        public
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "WEB3CXI ON-CHAIN", "description": "A simple SVG based on-chain NFT", "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    /* Mints the token */
    function mint(string memory svg) public onlyOwner {
        string memory imageURI = svgToImageURI(svg);
        string memory _tokenURI = formatTokenURI(imageURI);

        _tokenIds += 1;
        uint256 newItemId = _tokenIds;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        emit Minted(newItemId);
    }
}