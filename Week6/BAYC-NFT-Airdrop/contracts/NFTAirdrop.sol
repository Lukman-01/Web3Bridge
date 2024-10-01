// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

address constant BORED_APE_YATCH_CLUB_NFT_ADDRESS = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D;

contract NFTAirdrop {
    // state variables
    bytes32 public merkleRootHash; // The Merkle root hash used for verifying eligibility
    address public owner; // The address of the contract owner
    address public tokenAddress; // The address of the ERC20 token to be distributed

    // mappings -- to track users that have claimed tokens
    mapping(address => bool) usersClaimed; // Tracks whether a user has claimed their tokens

    // constructor
    /**
     * @dev Initializes the contract with the token address and Merkle root hash.
     * @param _tokenAddress The address of the ERC20 token contract.
     * @param _merkleRootHash The Merkle root hash for verifying eligible users.
     */
    constructor(address _tokenAddress, bytes32 _merkleRootHash) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        merkleRootHash = _merkleRootHash;
    }

    // errors
    error ZeroAddressNotAllowed(); // Reverts when the address provided is zero
    error ZeroAmountNotAllowed(); // Reverts when the amount provided is zero
    error UserAlreadyClaimed(); // Reverts when the user has already claimed their tokens
    error ClaimingFailed(); // Reverts when the token transfer fails during a claim
    error SorryYouAreNotEligible(); // Reverts when the user is not eligible for the claim
    error YouAreNotTheOwner(); // Reverts when the caller is not the owner of the contract
    error InsufficientTokenAmountFromSender(); // Reverts when the sender does not have enough tokens to deposit
    error InsufficientFundsPleaseTryAgain(); // Reverts when the contract does not have enough tokens to fulfill the claim
    error NoTokensRemainingToWithdraw(); // Reverts when there are no tokens left in the contract to withdraw
    error WithdrawalFailed(); // Reverts when the token transfer fails during withdrawal
    error YouDontHaveBAYCNFT();

    // events
    event UserClaimedTokens(); // Emitted when a user successfully claims tokens
    event DepositIntoContractSuccessful(address indexed sender, uint256 amount); // Emitted when tokens are successfully deposited into the contract

    /**
     * @dev Allows the owner to deposit tokens into the contract for distribution.
     * @param _amount The amount of tokens to deposit.
     */
    function depositIntoContract(uint256 _amount) external {
        _onlyOwner(); // Ensures only the owner can call this function
        if (_amount <= 0) revert ZeroAmountNotAllowed(); // Ensures the deposit amount is greater than zero

        // Get the token balance of the sender
        uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        // Revert if the sender does not have enough tokens to deposit
        if (_userTokenBalance < _amount)
            revert InsufficientTokenAmountFromSender();

        // Transfer tokens from the sender to the contract
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        // Emit deposit successful event
        emit DepositIntoContractSuccessful(msg.sender, _amount);
    }

    /**
     * @dev Allows the owner to update the Merkle root hash.
     * @param _new_merkle_root The new Merkle root hash.
     */
    function UpdateMerkleRoot(bytes32 _new_merkle_root) external {
        _onlyOwner(); // Ensures only the owner can call this function

        // Update the Merkle root hash
        merkleRootHash = _new_merkle_root;
    }

    /**
     * @dev Allows the owner to withdraw any remaining tokens in the contract.
     */
    function WithdrawRemainingTokens() external {
        _onlyOwner(); // Ensures only the owner can call this function

        // Get the current balance of tokens in the contract
        uint256 _contractBalance = IERC20(tokenAddress).balanceOf(
            address(this)
        );
        if (_contractBalance <= 0) revert NoTokensRemainingToWithdraw(); // Revert if no tokens are available

        // Transfer remaining tokens to the owner's account
        if (!IERC20(tokenAddress).transfer(owner, _contractBalance))
            revert WithdrawalFailed(); // Revert if the transfer fails
    }

    /**
     * @dev Allows eligible users to claim their reward tokens.
     * @param _amount The amount of tokens to claim.
     * @param _merkleProof The Merkle proof to verify eligibility.
     */
    function claimReward(
        uint256 _amount,
        bytes32[] calldata _merkleProof
    ) external {

        if (IERC721(BORED_APE_YATCH_CLUB_NFT_ADDRESS).balanceOf(msg.sender) <= 0 ){
            revert YouDontHaveBAYCNFT();
        }
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed(); // Revert if the sender's address is zero

        // Recreate the leaf node from the user's address and amount
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));

        // Verify the user's eligibility using the Merkle proof
        if (!MerkleProof.verify(_merkleProof, merkleRootHash, leaf))
            revert SorryYouAreNotEligible();

        // Revert if the user has already claimed their tokens
        if (usersClaimed[msg.sender]) revert UserAlreadyClaimed();

        // Mark the user as having claimed their tokens
        usersClaimed[msg.sender] = true;

        // Withdraw the eligible amount to the user
        _withdraw(msg.sender, _amount);

        // Emit event to indicate successful claim
        emit UserClaimedTokens();
    }

    /**
     * @dev Internal function to withdraw tokens to a specified address.
     * @param _to The address to send tokens to.
     * @param _amount The amount of tokens to send.
     */
    function _withdraw(address _to, uint256 _amount) internal {
        // Revert if the contract does not have enough tokens to fulfill the request
        if (IERC20(tokenAddress).balanceOf(address(this)) < _amount)
            revert InsufficientFundsPleaseTryAgain();

        // Revert if the token transfer fails
        if (!IERC20(tokenAddress).transfer(_to, _amount))
            revert ClaimingFailed();
    }

    /**
     * @dev Internal function to check if the caller is the owner.
     */
    function _onlyOwner() private view {
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed(); // Revert if the sender's address is zero
        if (msg.sender != owner) revert YouAreNotTheOwner(); // Revert if the sender is not the owner
    }
}
