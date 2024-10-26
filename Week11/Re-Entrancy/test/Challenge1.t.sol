// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import "../src/Challenge1.sol";

contract Challenge1Test is Test {
    Challenge chal;
    address owner = makeAddr("owner");
    address user = makeAddr("user");

    function setUp() public {
        vm.createSelectFork("https://eth-sepolia.g.alchemy.com/v2/QVY2UstBJhd7ELG4N6yM2GNbve_RT-0Y");
        vm.startPrank(owner);
        chal = new Challenge();
        vm.stopPrank();
    }

    function test_pause_only_owner_can_pause() public {
        vm.prank(owner);
        chal.pause(true);
        // assertTrue(chal.isPause());
    }

        function test_exploitMe_when_Paused_reverts() public {
        test_pause_only_owner_can_pause();
        vm.prank(user);
        vm.expectRevert();
        chal.exploit_me("user");
    }

    function testFail_exploitMe_when_Paused() public {
        test_pause_only_owner_can_pause();
        vm.prank(user);
        chal.exploit_me("user");
    }

    function test_user_cant_exploit_when_not_locked() public {
        vm.prank(user);
        vm.expectRevert();
        chal.exploit_me("user");
    }

    function test_can_reenter_and_set_lock() public {
        // vm.expectRevert();
        chal.exploit_me("user");
        assertEq(chal.HasInteracted(address(this)), true);
        assertEq(chal.winners(0), msg.sender);
        assertEq(chal.Names(msg.sender), "user");
    }

    function test_can_not_interact_twice() public {
        test_can_reenter_and_set_lock();
        vm.expectRevert("This address has interacted before");
        chal.exploit_me("user");
    }

    function test_getAllWinners() public{
       test_can_reenter_and_set_lock();
       string[] memory _names2 = chal.getAllwiners();
       assertEq(_names2[0], "user");
    }

    function test_getAllWinners_onChain() public view{
       string[] memory _names = chal.getAllwiners();
       for(uint i; i < _names.length; i++){
           console2.log("winner", i + 1, _names[i]);
       }
        
    }




    uint count;
    receive() external payable {
       
             chal.lock_me();
            console2.log("locked");

    }



}