// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibDiamond } from "../libraries/LibDiamond.sol";

contract SignatureVerificationFacet {

    event TokensClaimed(address indexed user, uint256 amount);

    // Add addresses to the whitelist
    function addToWhitelist(address[] memory _addresses) public {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        for (uint256 i = 0; i < _addresses.length; i++) {
            ds.whitelist[_addresses[i]] = true;
        }
    }

    // Claim tokens by providing the message hash and signature
    function claimTokens(bytes32 messageHash, bytes memory signature) public {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        require(ds.whitelist[msg.sender], "Not whitelisted");
        require(!ds.hasClaimed[msg.sender], "Already claimed");

        address signer = recoverSigner(messageHash, signature);
        require(signer == msg.sender, "Invalid signature");

        ds.hasClaimed[msg.sender] = true;
        require(ds.token.transfer(msg.sender, ds.claimAmount), "Token transfer failed");

        emit TokensClaimed(msg.sender, ds.claimAmount);
    }

    // Function to recover the signer of the message
    function recoverSigner(bytes32 messageHash, bytes memory signature) public pure returns (address) {
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    // Convert the message hash into the Ethereum signed message hash
    function getEthSignedMessageHash(bytes32 messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }

    // Split the signature into r, s, and v
    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
