// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibDiamond} from "../libraries/LibDiamond.sol";

contract ManageFinanceFacet {
    function addBalance() external payable {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        ds.contractBalance += msg.value;
    }

    function withdraw(uint _amount) external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        if (msg.sender != ds.contractOwner) revert LibDiamond.NotDiamondOwner();
        if (_amount > ds.contractBalance) revert LibDiamond.InvalidAmount();

        ds.contractBalance -= _amount;

        (bool sent, ) = msg.sender.call{value: _amount}("");
        if (!sent) revert LibDiamond.TransactionFailed();
    }

    receive() external payable {}
}
