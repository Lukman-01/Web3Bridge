// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract BankAccount {
    /**
     * @dev Represents a user in the bank system.
     * @param balance The current balance of the user.
     * @param name The name of the user.
     * @param age The age of the user.
     * @param hasRegistered Whether the user has registered in the system.
     */
    struct User {
        uint256 balance;     // 32 bytes
        string name;         // Dynamic size
        uint8 age;           // 1 byte
        bool hasRegistered;  // 1 byte
    }

    // Address of the contract owner
    address public owner;

    // Total number of registered users
    uint256 public userCount;

    // Mapping from user addresses to user data
    mapping(address => User) public users;

    // List of user addresses
    address[] public userAddresses;

    // Custom errors for specific failure conditions
    error AlreadyRegistered();
    error NotRegistered();
    error InsufficientBalance();
    error DepositTooLow();
    error NotOwner();
    error CallFailed();

    // Events to log key actions in the contract
    event AccountCreated(address indexed user, string name, uint8 age);
    event DepositMade(address indexed user, uint256 amount);
    event TransferMade(address indexed from, address indexed to, uint256 amount);
    event WithdrawalMade(address indexed user, uint256 amount);
    event EtherWithdrawn(address indexed owner, uint amount);

    /**
     * @dev Sets the owner of the contract to the deployer.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to restrict certain functions to the owner.
     */
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    /**
     * @dev Creates a new account for the caller with a given name and age.
     * @param _name The name of the user.
     * @param _age The age of the user.
     */
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

    /**
     * @dev Deposits Ether into the caller's account.
     * The deposit amount must be greater than 1 Ether.
     */
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

    /**
     * @dev Transfers a specified amount from the caller's account to another user's account.
     * @param _to The address of the recipient.
     * @param _amount The amount to be transferred.
     */
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

    /**
     * @dev Withdraws a specified amount of Ether from the caller's account.
     * @param _amount The amount to be withdrawn.
     */
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

    /**
     * @dev Withdraws a specified amount of Ether from the contract balance.
     * This function can only be called by the owner.
     * @param _amount The amount to be withdrawn.
     */
    function withdrawEther(uint _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient contract balance");

        (bool success, ) = owner.call{value: _amount}("");
        if (!success) {
            revert CallFailed();
        }

        emit EtherWithdrawn(owner, _amount);
    }

    /**
     * @dev Returns the number of registered users.
     * @return The number of users registered in the contract.
     */
    function getUserCount() external view returns (uint256) {
        return userCount;
    }

    /**
     * @dev Returns the information of a specific user.
     * @param _user The address of the user.
     * @return name The name of the user.
     * @return age The age of the user.
     * @return balance The balance of the user.
     * @return hasRegistered Whether the user is registered.
     */
    function getUserInfo(address _user) external view returns (string memory name, uint8 age, uint256 balance, bool hasRegistered) {
        User storage user = users[_user];
        if (!user.hasRegistered) {
            revert NotRegistered();
        }
        return (user.name, user.age, user.balance, user.hasRegistered);
    }

    /**
     * @dev Fallback function to receive Ether.
     */
    receive() external payable {}

    /**
     * @dev Returns the contract's balance.
     * @return The amount of Ether held by the contract.
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
