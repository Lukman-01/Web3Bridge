// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BankAccount {
    struct User {
        uint256 balance;     // 32 bytes
        string name;         // Dynamic size
        uint8 age;           // 1 byte
        bool hasRegistered;  // 1 byte
    }

    address public owner;
    uint256 public userCount;
    mapping(address => User) private users;
    address[] private userAddresses;

    // Custom errors
    error AlreadyRegistered();
    error NotRegistered();
    error InsufficientBalance();
    error DepositTooLow();
    error NotOwner();
    error CallFailed();

    // Events
    event AccountCreated(address indexed user, string name, uint8 age);
    event DepositMade(address indexed user, uint256 amount);
    event TransferMade(address indexed from, address indexed to, uint256 amount);
    event WithdrawalMade(address indexed user, uint256 amount);
    event EtherWithdrawn(address indexed owner, uint amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    // Create a new user account
    function createAccount(string calldata _name, uint8 _age) external {
        User storage user = users[msg.sender];
        if (user.hasRegistered) {
            revert AlreadyRegistered();
        }

        user.hasRegistered = true;
        user.name = _name;
        user.age = _age;
        user.balance = 0;

        userAddresses.push(msg.sender);
        userCount++;

        emit AccountCreated(msg.sender, _name, _age);
    }

    // Deposit funds into the user's account
    function deposit() external payable {
        if (msg.value <= 1 ether) {
            revert DepositTooLow();
        }

        User storage user = users[msg.sender];
        if (!user.hasRegistered) {
            revert NotRegistered();
        }

        user.balance += msg.value;

        emit DepositMade(msg.sender, msg.value);
    }

    // Transfer funds to another user's account
    function transfer(address _to, uint256 _amount) external {
        User storage sender = users[msg.sender];
        if (!sender.hasRegistered) {
            revert NotRegistered();
        }

        User storage receiver = users[_to];
        if (!receiver.hasRegistered) {
            revert NotRegistered();
        }

        if (sender.balance < _amount) {
            revert InsufficientBalance();
        }

        sender.balance -= _amount;
        receiver.balance += _amount;

        emit TransferMade(msg.sender, _to, _amount);
    }

    // Withdraw funds from the user's account
    function withdraw(uint256 _amount) external {
        User storage user = users[msg.sender];
        if (!user.hasRegistered) {
            revert NotRegistered();
        }

        if (user.balance < _amount) {
            revert InsufficientBalance();
        }

        user.balance -= _amount;

        (bool success, ) = msg.sender.call{value: _amount}("");
        if (!success) {
            revert CallFailed();
        }

        emit WithdrawalMade(msg.sender, _amount);
    }

    // Withdraw Ether from the contract (onlyOwner)
    function withdrawEther(uint _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient contract balance");

        (bool success, ) = owner.call{value: _amount}("");
        if (!success) {
            revert CallFailed();
        }

        emit EtherWithdrawn(owner, _amount);
    }

    // Get the number of registered users
    function getUserCount() external view returns (uint256) {
        return userCount;
    }

    // Get information about a particular user
    function getUserInfo(address _user) external view returns (string memory, uint8, uint256) {
        User storage user = users[_user];
        if (!user.hasRegistered) {
            revert NotRegistered();
        }
        return (user.name, user.age, user.balance);
    }

    // Fallback function to receive Ether
    receive() external payable {}

    // Function to check the contract's balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
