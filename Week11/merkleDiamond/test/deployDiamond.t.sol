// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console2} from "forge-std/Test.sol";
import "src/contracts/Diamond.sol";
import "src/contracts/interfaces/IDiamondCut.sol";
import "src/contracts/facets/DiamondCutFacet.sol";
import "src/contracts/facets/DiamondLoupeFacet.sol";
import "src/contracts/facets/OwnershipFacet.sol";
import "src/contracts/facets/ERC721Facet.sol";
import "src/contracts/facets/MerkleFacet.sol";
import "src/contracts/facets/PresaleFacet.sol";

import "./helpers/DiamondUtils.sol";

contract DiamondDeployer is Test, DiamondUtils, IDiamondCut {
    Diamond diamond;
    DiamondCutFacet dCutFacet;
    DiamondLoupeFacet dLoupe;
    OwnershipFacet ownerF;
    ERC721Facet erc721Facet;
    MerkleFacet merkleFacet;
    PresaleFacet presaleFacet;

    bytes32 public merkleRoot;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        dCutFacet = new DiamondCutFacet();
        diamond = new Diamond(address(this), address(dCutFacet));
        dLoupe = new DiamondLoupeFacet();
        ownerF = new OwnershipFacet();
        erc721Facet = new ERC721Facet();
        merkleFacet = new MerkleFacet();
        presaleFacet = new PresaleFacet();

        FacetCut[] memory cut = new FacetCut[](5);

        cut[0] = FacetCut({
            facetAddress: address(dLoupe),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("DiamondLoupeFacet")
        });

        cut[1] = FacetCut({
            facetAddress: address(ownerF),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("OwnershipFacet")
        });
        cut[2] = FacetCut({
            facetAddress: address(erc721Facet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("ERC721Facet")
        });
        cut[3] = FacetCut({
            facetAddress: address(merkleFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("MerkleFacet")
        });
        cut[4] = FacetCut({
            facetAddress: address(presaleFacet),
            action: FacetCutAction.Add,
            functionSelectors: generateSelectors("PresaleFacet")
        });

        IDiamondCut(address(diamond)).diamondCut(cut, address(0x0), "");

        owner = address(this);
        user1 = address(0x1111);
        user2 = address(0x2222);

        // string[] memory inputs = new string[](3);
        // inputs[0] = "npx";
        // inputs[1] = "ts-node";
        // inputs[2] = "./merkle/generateMerkleTree.ts";
        // bytes memory result = vm.ffi(inputs);
        merkleRoot = abi.decode("0xbdf043ccaff5ac3f589906608c081d1298d5a3d51f472203bcca01ca8dacfa41", (bytes32));

        MerkleFacet(address(diamond)).setMerkleRoot(merkleRoot);

        PresaleFacet(address(diamond)).setPresaleParameters(
            33333333333333333, // Approximately 1 ether / 30
            0.01 ether,
            1 ether
        );
    }

    function testDeployDiamond() public view {
        address[] memory facetAddresses = DiamondLoupeFacet(address(diamond))
            .facetAddresses();
        assertEq(facetAddresses.length, 6);
    }

    function testFailInvalidPresaleAmount() public {
        vm.deal(user2, 1 ether);
        vm.prank(user2);
        uint256 invalidAmount = 0.5 ether; // Amount less than minimum
        vm.expectRevert("Insufficient payment");
        PresaleFacet(address(diamond)).buyPresale{value: invalidAmount}(3);
    }

    function testFailUnauthorizedTransfer() public {
        // First, mint a token to user1
        string[] memory inputs = new string[](3);
        inputs[0] = "node";
        inputs[1] = "./merkle/generateMerkleProof.js";
        inputs[2] = vm.toString(user1);
        bytes memory result = vm.ffi(inputs);
        bytes32[] memory proof = abi.decode(result, (bytes32[]));

        vm.prank(user1);
        MerkleFacet(address(diamond)).claim(proof);

        // Try to transfer from user2 (who doesn't own the token)
        vm.prank(user2);
        vm.expectRevert("ERC721: caller is not token owner or approved");
        ERC721Facet(address(diamond)).transferFrom(user1, user2, 0);
    }

    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external override {}
}