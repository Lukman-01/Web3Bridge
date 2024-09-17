// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

//import ""; // Adjust the path as needed


interface IMultiSig {

    function transfer(uint256 _amount, address _recipient, address _tokenAddress) external;

    function approveTx(uint8 _txId) external;

    function proposeAndApproveQuorum(uint8 _newQuorum) external;

    //function getOneTransaction(uint8 _txId) external view returns(Transaction memory);
}