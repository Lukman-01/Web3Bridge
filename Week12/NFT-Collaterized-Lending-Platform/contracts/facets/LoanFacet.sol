// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibDiamond} from "../libraries/LibDiamond.sol";

contract LoanFacet {
    event LoanGiven(
        address indexed borrower,
        uint indexed amount,
        uint indexed time
    );
    event LoanPaid(
        address indexed borrower,
        uint indexed amount,
        uint indexed time
    );

    function requestLoan(uint _amount) external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        LibDiamond.Position memory _position = ds.positions[msg.sender];

        address _nft = _position.nft;
        uint _value = _position.nftValue;

        if (_nft == address(0)) revert LibDiamond.NoStake();
        if (_amount > _value) revert LibDiamond.InvalidAmount();
        if (_amount > ds.contractBalance) revert LibDiamond.InvalidAmount();
        if (_position.loanedAmount > 0) revert LibDiamond.CurrentlyOwing();

        _position.timeLoaned = block.timestamp;
        _position.loanedAmount = _amount;

        ds.positions[msg.sender] = _position;

        ds.contractBalance -= _amount;

        (bool sent, ) = msg.sender.call{value: _amount}("");
        if (!sent) revert LibDiamond.TransactionFailed();

        emit LoanGiven(msg.sender, _amount, block.timestamp);
    }

    function payBack() external payable {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        LibDiamond.Position memory _position = ds.positions[msg.sender];

        uint loanedAmount = _position.loanedAmount;

        if (loanedAmount == 0) revert LibDiamond.NoStake();

        uint timeLoanedFor = block.timestamp - _position.timeLoaned;

        uint amountOwed = loanedAmount + (timeLoanedFor * ds.interestRate);

        if (msg.value < amountOwed) revert LibDiamond.InvalidAmount();

        ds.contractBalance += msg.value;

        _position.loanedAmount = 0;
        _position.timeLoaned = 0;

        ds.positions[msg.sender] = _position;

        emit LoanPaid(msg.sender, msg.value, block.timestamp);
    }

    function setInterestRate(uint8 _rate) internal {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        if (msg.sender != ds.contractOwner) revert LibDiamond.NotDiamondOwner();

        ds.interestRate = _rate;
    }

    function getInterestRate() external view returns (uint8) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        return ds.interestRate;
    }

    function getLoanableAmount() external view returns (uint) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        LibDiamond.Position memory _position = ds.positions[msg.sender];

        address _nft = _position.nft;
        uint _value = _position.nftValue;

        if (_nft == address(0)) revert LibDiamond.NoStake();

        return _value;
    }

    receive() external payable {}
}
