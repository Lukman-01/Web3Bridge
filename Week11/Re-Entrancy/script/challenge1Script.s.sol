// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import {Script, console2} from "forge-std/Script.sol";

import "../src/Challenge1.sol";

contract Challenge1Script is Script{
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        Challenge chal =  Challenge(0x771F8f8FD270eD99db6a3B5B7e1d9f6417394249);
        Attack attack = new Attack();
    }
}