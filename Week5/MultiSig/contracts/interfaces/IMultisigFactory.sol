// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "../MultiSig.sol";

interface IMultisigFactory {

    function createMultisigWallet(uint8 _quorum, address[] memory _validSigners) external returns (MultiSig newMulsig_, uint256 length_);

    
    function getMultiSigClones() external view returns(MultiSig[] memory);
}