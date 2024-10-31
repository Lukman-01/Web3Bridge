// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;

// import "../contracts/interfaces/IDiamondCut.sol";
// import "../contracts/facets/DiamondCutFacet.sol";
// import "../contracts/facets/DiamondLoupeFacet.sol";
// import "../contracts/facets/OwnershipFacet.sol";
// import "../contracts/Diamond.sol";
// import "../contracts/facets/ERC721Facet.sol";
// import "./helpers/DiamondUtils.sol";
// import {Test, console2} from "forge-std/Test.sol";
// import {stdJson} from "forge-std/StdJson.sol";

// contract DiamondDeployer is Test, DiamondUtils, IDiamondCut {
//     //contract types of facets to be deployed
//     Diamond diamond;
//     DiamondCutFacet dCutFacet;
//     DiamondLoupeFacet dLoupe;
//     OwnershipFacet ownerF;
//     ERC721Facet erc721Facet;

//     function testDeployDiamond() public {
//         //deploy facets
//         dCutFacet = new DiamondCutFacet();
//         diamond = new Diamond(address(this), address(dCutFacet));
//         dLoupe = new DiamondLoupeFacet();
//         ownerF = new OwnershipFacet();

//         //upgrade diamond with facets
//         erc721Facet = new ERC721Facet();

//         //build cut struct
//         FacetCut[] memory cut = new FacetCut[](5);

//         cut[0] = (
//             FacetCut({
//                 facetAddress: address(dLoupe),
//                 action: FacetCutAction.Add,
//                 functionSelectors: generateSelectors("DiamondLoupeFacet")
//             })
//         );

//         cut[1] = (
//             FacetCut({
//                 facetAddress: address(ownerF),
//                 action: FacetCutAction.Add,
//                 functionSelectors: generateSelectors("OwnershipFacet")
//             })
//         );

//         cut[2] = FacetCut({
//             facetAddress: address(erc721Facet),
//             action: FacetCutAction.Add,
//             functionSelectors: generateSelectors("ERC721Facet")
//         });

//         //upgrade diamond
//         IDiamondCut(address(diamond)).diamondCut(cut, address(0x0), "");

//         string[] memory inputs = new string[](3);
//         inputs[0] = "npx";
//         inputs[1] = "ts-node";
//         inputs[2] = "../scripts/merkleRoot.ts";

//         DiamondLoupeFacet(address(diamond)).facetAddresses();
//     }

//     function diamondCut(
//         FacetCut[] calldata _diamondCut,
//         address _init,
//         bytes calldata _calldata
//     ) external override {}
// }
