// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SaveEther {

    // State variable to store the owner of the contract
    address owner;

    // Mapping to store the balances of each user
    mapping(address => uint256) balances;

    // Constructor function, executed only once when the contract is deployed
    constructor() {
        owner = msg.sender;  // Set the contract deployer as the owner
    }

    // Events to log deposits, withdrawals, and transfers
    event DepositSuccessful(address indexed _user, uint256 indexed _amount);
    event WithdrawalSuccessful(address indexed _user, uint256 indexed _amount);
    event TransferSuccessful(address indexed _user, address indexed _to, uint256 indexed _amount);

    /**
     * @dev Allows a user to deposit Ether into the contract.
     * The deposit amount is added to the user's balance.
     */
    function deposit() external payable {
        require(msg.sender != address(0), "zero address detected");  // Ensure the sender is not the zero address
        require(msg.value > 0, "you cannot deposit zero");           // Ensure the deposit amount is greater than zero

        // Update the user's balance
        balances[msg.sender] += msg.value;

        // Emit an event to log the deposit
        emit DepositSuccessful(msg.sender, msg.value);
    }

    /**
     * @dev Allows a user to withdraw Ether from their balance.
     * The withdrawal amount is subtracted from the user's balance and sent to the user.
     * @param _amount The amount to withdraw.
     */
    function withdraw(uint256 _amount) external {
        require(msg.sender != address(0), "zero address detected");            // Ensure the sender is not the zero address
        require(_amount > 0, "zero amount not withdrawable!");                 // Ensure the withdrawal amount is greater than zero
        require(balances[msg.sender] >= _amount, "insufficient balance");      // Ensure the user has enough balance to withdraw

        // Update the user's balance
        balances[msg.sender] -= _amount;

        // Transfer the Ether to the user
        (bool success,) = msg.sender.call{value : _amount}("");
        require(success, "failed withdrawal!");  // Revert if the transfer fails
    }

    /**
     * @dev Returns the total Ether balance held by the contract.
     * @return The contract's balance in Wei.
     */
    function getContractBalance() external view returns(uint256) {
        return address(this).balance;  // Return the contract's Ether balance
    }

    /**
     * @dev Returns the balance of the caller.
     * @return The caller's balance in the contract.
     */
    function myBalance() external view returns(uint256) {
        return balances[msg.sender];  // Return the balance of the caller
    } 

    /**
     * @dev Allows a user to transfer Ether from their balance to another address.
     * @param _amount The amount to transfer.
     * @param _to The address of the recipient.
     */
    function transfer(uint256 _amount, address _to) external payable {
        require(msg.sender != address(0), "zero address detected");            // Ensure the sender is not the zero address
        require(_to != address(0), "zero address detected");                   // Ensure the recipient is not the zero address
        require(_amount > 0, "zero amount not withdrawable!");                 // Ensure the transfer amount is greater than zero
        require(balances[msg.sender] >= _amount, "insufficient funds");        // Ensure the user has enough balance to transfer

        // Update the sender's balance
        balances[msg.sender] -= _amount;

        // Transfer the Ether to the recipient
        payable(_to).transfer(_amount);
    }

}
