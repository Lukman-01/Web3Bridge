// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title OveraToken ERC20 Token Contract
/// @dev This contract implements basic ERC20 functionality with minting and burning features.
contract OGToken is ERC20{

    address owner;

    /// @notice Emitted when tokens are minted
    /// @param to The address that received the minted tokens
    /// @param amount The number of tokens minted
    event TokensMinted(address indexed to, uint256 amount);

    /// @notice Emitted when tokens are burned
    /// @param from The address from which tokens were burned
    /// @param amount The number of tokens burned
    event TokensBurned(address indexed from, uint256 amount);

    /// @dev Custom error for insufficient balance
    error InsufficientBalance(address account, uint256 balance, uint256 amount);

    /// @dev Custom error for insufficient allowance
    error InsufficientAllowance(address from, address spender, uint256 allowance, uint256 amount);

    /// @dev Custom error for invalid approval amounts
    error InvalidApprovalAmount(address owner, address spender, uint256 currentAllowance);


    modifier onlyOwner{
        require(msg.sender == owner, "only owner");
        _;
    }
    constructor(uint256 initialSupply) ERC20("OGToken", "OGT") {
        _mint(msg.sender, initialSupply);
    }

    /// @notice Mint new tokens to a specified address (Only callable by the contract owner)
    /// @param to The address to receive the minted tokens
    /// @param amount The number of tokens to mint
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /// @notice Burn tokens from a specified address (Only callable by the contract owner)
    /// @param from The address from which to burn tokens
    /// @param amount The number of tokens to burn
    function burn(address from, uint256 amount) public onlyOwner{
        if (balanceOf(from) < amount) {
            revert InsufficientBalance(from, balanceOf(from), amount);
        }
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    /// @notice Transfer tokens from the caller's address to a specified address
    /// @param to The address to receive the tokens
    /// @param amount The number of tokens to transfer
    /// @return A boolean value indicating whether the operation succeeded
    function transfer(address to, uint256 amount) public override returns (bool) {
        if (balanceOf(msg.sender) < amount) {
            revert InsufficientBalance(msg.sender, balanceOf(msg.sender), amount);
        }
        _transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice Approve an address to spend a certain amount of tokens on behalf of the caller
    /// @param spender The address authorized to spend tokens
    /// @param amount The number of tokens the spender is allowed to spend
    /// @return A boolean value indicating whether the operation succeeded
    function approve(address spender, uint256 amount) public override returns (bool) {
        if (amount > 0 && allowance(msg.sender, spender) > 0) {
            revert InvalidApprovalAmount(msg.sender, spender, allowance(msg.sender, spender));
        }
        _approve(msg.sender, spender, amount);
        return true;
    }

    /// @notice Transfer tokens from one address to another using an allowance
    /// @param from The address from which tokens are transferred
    /// @param to The address to receive the tokens
    /// @param amount The number of tokens to transfer
    /// @return A boolean value indicating whether the operation succeeded
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        uint256 currentAllowance = allowance(from, msg.sender);
        if (currentAllowance < amount) {
            revert InsufficientAllowance(from, msg.sender, currentAllowance, amount);
        }
        _transfer(from, to, amount);
        _approve(from, msg.sender, currentAllowance - amount);
        return true;
    }

    /// @notice Get the balance of a specified address
    /// @param account The address to query for its balance
    /// @return The balance of the specified address
    function getBalanceOf(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}