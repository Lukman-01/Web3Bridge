// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./MultiSig.sol";

contract MultisigFactory{
    MultiSig[] multisigClones;

    function createMultisigWallet(uint8 _quorum, address[] memory _validSigners) external returns (MultiSig newMulsig_, uint256 length_) {

        newMulsig_ = new MultiSig(_quorum, _validSigners);

        multisigClones.push(newMulsig_);

        length_ = multisigClones.length;
    }

    function getMultiSigClones() external view returns(MultiSig[] memory) {
        return multisigClones;
    }
}