// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721 {
    address private _owner;
    uint256 public nextTokenId;

    struct Listing {
        address seller;
        uint256 price;
        bool isForSale;
    }

    // Mapping from token ID to its listing details
    mapping(uint256 => Listing) public listings;

    // Modifier to restrict function access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    constructor() ERC721("NFTMarketplace", "NFTM") {
        _owner = msg.sender; // Set the deployer as the initial owner
        nextTokenId = 1; // Initialize token ID to 1
    }

    /**
     * @dev Mint new NFTs. Only contract owner can mint.
     * @param to Address of the receiver of the minted NFT.
     */
    function mint(address to) external onlyOwner {
        uint256 tokenId = nextTokenId; // Assign current token ID
        nextTokenId++; // Increment token ID for next mint

        _safeMint(to, tokenId);
    }

    /**
     * @dev List an NFT for sale. Only the owner of the token can list it.
     * @param tokenId ID of the token to list for sale.
     * @param price Sale price in wei.
     */
    function listForSale(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(price > 0, "Price must be greater than 0");

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isForSale: true
        });
    }

    /**
     * @dev Buy an NFT that is listed for sale. Buyer sends ETH equivalent to the price.
     * @param tokenId ID of the token to buy.
     */
    function buy(uint256 tokenId) external payable {
        Listing memory listedItem = listings[tokenId];

        require(listedItem.isForSale, "Token not for sale");
        require(msg.value >= listedItem.price, "Insufficient funds");

        // Transfer ownership of the NFT
        _transfer(listedItem.seller, msg.sender, tokenId);

        // Mark as no longer for sale
        listings[tokenId].isForSale = false;

        // Transfer the sale price to the seller
        payable(listedItem.seller).transfer(msg.value);
    }

    /**
     * @dev Remove an NFT from being listed for sale. Only the owner can remove the listing.
     * @param tokenId ID of the token to remove from sale.
     */
    function removeListing(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(listings[tokenId].isForSale, "Token is not listed for sale");

        delete listings[tokenId];
    }

    /**
     * @dev Change the price of an NFT that is already listed for sale. Only the seller can update.
     * @param tokenId ID of the token to update price.
     * @param newPrice The new sale price in wei.
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) external {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(listings[tokenId].isForSale, "Token not listed for sale");
        require(newPrice > 0, "Price must be greater than 0");

        listings[tokenId].price = newPrice;
    }

    /**
     * @dev Withdraw contract's balance. Only the owner of the contract can withdraw.
     */
    function withdraw() external onlyOwner {
        payable(_owner).transfer(address(this).balance);
    }

    /**
     * @dev Returns the address of the contract owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        _owner = newOwner;
    }
}
