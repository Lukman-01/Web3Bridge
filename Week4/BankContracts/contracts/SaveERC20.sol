// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SaveERC20 {
    // Custom errors for better gas efficiency
    error AddressZeroDetected();
    error ZeroValueNotAllowed();
    error CantSendToZeroAddress();
    error InsufficientFunds();
    error NotOwner();
    error InsufficientContractBalance();

    // State variables
    address public owner; // The owner of the contract
    address public tokenAddress; // The ERC20 token address that this contract interacts with
    mapping(address => uint256) balances; // Mapping to track the balance of each user

    // Events to log successful operations
    event DepositSuccessful(address indexed user, uint256 indexed amount);
    event WithdrawalSuccessful(address indexed user, uint256 indexed amount);
    event TransferSuccessful(address indexed from, address indexed _to, uint256 indexed amount);

    /**
     * @dev Constructor to initialize the contract with the ERC20 token address and set the owner.
     * @param _tokenAddress The address of the ERC20 token.
     */
    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    /**
     * @dev Allows users to deposit a specified amount of tokens into the contract.
     * @param _amount The amount of tokens to deposit.
     */
    function deposit(uint256 _amount) external {
        if(msg.sender == address(0)) {
            revert AddressZeroDetected();
        }

        if(_amount <= 0) {
            revert ZeroValueNotAllowed();
        }

        uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        if(_userTokenBalance < _amount) {
            revert InsufficientFunds();
        }

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        balances[msg.sender] += _amount;

        emit DepositSuccessful(msg.sender, _amount);
    }

    /**
     * @dev Allows users to withdraw a specified amount of tokens from their balance in the contract.
     * @param _amount The amount of tokens to withdraw.
     */
    function withdraw(uint256 _amount) external {
        if(msg.sender == address(0)) {
            revert AddressZeroDetected();
        }

        if(_amount <= 0) {
            revert ZeroValueNotAllowed();
        }

        uint256 _userBalance = balances[msg.sender];

        if(_amount > _userBalance) {
            revert InsufficientFunds();
        }

        balances[msg.sender] -= _amount;

        IERC20(tokenAddress).transfer(msg.sender, _amount);

        emit WithdrawalSuccessful(msg.sender, _amount);
    }

    /**
     * @dev Returns the balance of the caller in the contract.
     * @return The balance of the caller.
     */
    function myBalance() external view returns(uint256) {
        return balances[msg.sender];
    }

    /**
     * @dev Allows the owner to view the balance of any user.
     * @param _user The address of the user.
     * @return The balance of the specified user.
     */
    function getAnyBalance(address _user) external view returns(uint256) {
        onlyOwner();
        return balances[_user];
    }

    /**
     * @dev Allows the owner to view the total balance of tokens held by the contract.
     * @return The total balance of tokens in the contract.
     */
    function getContractBalance() external view returns(uint256) {
        onlyOwner();
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    /**
     * @dev Allows users to transfer a specified amount of tokens to another address within the contract.
     * @param _to The address to transfer tokens to.
     * @param _amount The amount of tokens to transfer.
     */
    function transferFunds(address _to, uint256 _amount) external {
        if(msg.sender == address(0)) {
            revert AddressZeroDetected();
        }
        if(_to == address(0)) {
            revert CantSendToZeroAddress();
        }

        if(_amount > balances[msg.sender]) {
            revert InsufficientFunds();
        }

        balances[msg.sender] -= _amount;

        IERC20(tokenAddress).transfer(_to, _amount);

        emit TransferSuccessful(msg.sender, _to, _amount);
    }

    /**
     * @dev Allows a user to transfer tokens from their balance to another user's balance within the contract.
     * This does not involve an external ERC20 transfer, just an internal balance update.
     * @param _user The address of the recipient.
     * @param _amount The amount of tokens to transfer.
     */
    function depositForAnotherUserFromWithin(address _user, uint256 _amount) external {
        if(msg.sender == address(0)) {
            revert AddressZeroDetected();
        }

        if(_user == address(0)) {
            revert CantSendToZeroAddress();
        }

        if(_amount > balances[msg.sender]) {
            revert InsufficientFunds();
        }

        balances[msg.sender] -= _amount;
        balances[_user] += _amount;
    }

    /**
     * @dev Allows a user to deposit tokens into the contract on behalf of another user.
     * This involves transferring tokens from the sender's external ERC20 balance to the contract.
     * @param _user The address of the recipient.
     * @param _amount The amount of tokens to deposit.
     */
    function depositForAnotherUser(address _user, uint256 _amount) external {
        if(msg.sender == address(0)) {
            revert AddressZeroDetected();
        }

        if(_user == address(0)) {
            revert CantSendToZeroAddress();
        }

        uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        if(_amount > _userTokenBalance) {
            revert InsufficientFunds();
        }

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        balances[_user] += _amount;
    }

    /**
     * @dev Allows the owner to withdraw tokens from the contract's balance.
     * @param _amount The amount of tokens to withdraw.
     */
    function ownerWithdraw(uint256 _amount) external {
        onlyOwner();

        if(_amount > IERC20(tokenAddress).balanceOf(address(this))) {
            revert InsufficientContractBalance();
        }

        IERC20(tokenAddress).transfer(owner, _amount);
    }

    /**
     * @dev Internal function to restrict access to the owner.
     * Reverts if the caller is not the owner.
     */
    function onlyOwner() private view {
        if(msg.sender != owner) {
            revert NotOwner();
        }
    }
}