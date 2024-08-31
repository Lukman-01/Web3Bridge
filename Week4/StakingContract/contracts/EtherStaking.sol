// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract EtherStaking{
    address public owner;
    uint256 public rewardRate; // Reward rate in percentage per day
    mapping(address => Stake) private stakes;

    // Custom errors for gas optimization
    error NotOwner();
    error ZeroAddressDetected();
    error InsufficientAmount();
    error CannotDepositZero();
    error NoStakes();
    error StakingPeriodNotElapsed();

    event Staked(address indexed user, uint256 indexed amount, uint256 indexed timestamp);
    event WithdrawalSuccessful(address indexed user, uint256 indexed amount);
    event RewardWithdrawn(address indexed user, uint256 indexed amount);
    event Deposit(address indexed sender, uint256 amount);

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 duration; // in seconds
    }

    /**
     * @dev Initializes the contract, setting the deployer as the owner and assigning the reward rate.
     * @param _rewardRate The initial reward rate (e.g., 1 for 1% per day).
     */
    constructor(uint256 _rewardRate) {
        owner = msg.sender;
        rewardRate = _rewardRate;
    }

    /**
     * @dev Checks if the caller is the owner.
     * Replaces the `onlyOwner` modifier.
     */
    function _checkOwner() private view {
        if (msg.sender != owner) {
            revert NotOwner();
        }
    }

    /**
     * @dev Allows the owner to deposit Ether into the contract.
     */
    function deposit() external payable {
        require(msg.value > 0, "Must deposit more than 0 Ether");
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Allows a user to stake Ether into the contract.
     * @param _duration The duration in days the user wants to stake their Ether.
     * The amount of Ether to stake is sent along with the transaction.
     */
    function stake(uint256 _duration) external payable {
        if (msg.sender == address(0)) {
            revert ZeroAddressDetected();
        }

        if (msg.value == 0) {
            revert CannotDepositZero();
        }

        // Convert duration from days to seconds
        uint256 durationInSeconds = _duration;

        // Record the stake
        Stake storage userStake = stakes[msg.sender];
        userStake.amount += msg.value;
        userStake.startTime = block.timestamp;
        userStake.duration = durationInSeconds;

        emit Staked(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Calculates the reward based on staking duration and the reward rate.
     * @param _user The address of the user to calculate rewards for.
     * @return The calculated reward.
     */
    function calculateReward(address _user) public view returns (uint256) {
        Stake storage userStake = stakes[_user];
        uint256 stakingDuration = block.timestamp - userStake.startTime;
        uint256 reward = (userStake.amount * stakingDuration * rewardRate) / (100 * 1 days);
        return reward;
    }

    /**
     * @dev Allows a user to withdraw their staked Ether and rewards after the staking period has elapsed.
     */
    function withdrawStake() external {
        if (msg.sender == address(0)) {
            revert ZeroAddressDetected();
        }

        Stake storage userStake = stakes[msg.sender];
        uint256 stakedAmount = userStake.amount;
        uint256 reward = calculateReward(msg.sender);

        if (stakedAmount == 0) {
            revert NoStakes();
        }

        // Ensure the staking period has elapsed
        if (block.timestamp < userStake.startTime + userStake.duration) {
            revert StakingPeriodNotElapsed();
        }

        // Reset the staked amount before transferring Ether to avoid reentrancy attacks
        userStake.amount = 0;
        userStake.startTime = 0;
        userStake.duration = 0;

        // Transfer staked amount + reward back to the user
        uint256 totalAmount = stakedAmount + reward;
        require(address(this).balance >= totalAmount, "Contract balance insufficient");

        (bool success, ) = msg.sender.call{value: totalAmount}("");
        require(success, "Failed to transfer Ether");

        emit WithdrawalSuccessful(msg.sender, totalAmount);
    }

    /**
     * @dev Retrieves the staked amount of a specified user.
     * @param _user The address of the user to retrieve the staked amount for.
     * @return The staked amount of the specified user.
     */
    function getStakedAmount(address _user) external view returns (uint256) {
        return stakes[_user].amount;
    }

    /**
     * @dev Retrieves the Ether balance held by the contract.
     * @return The Ether balance of the contract.
     */
    function getContractBalance() external view returns (uint256) {
        _checkOwner(); // Private function call replaces onlyOwner modifier
        return address(this).balance;
    }

    /**
     * @dev Allows the owner to set a new reward rate.
     * @param _newRate The new reward rate (e.g., 1 for 1% per day).
     */
    function setRewardRate(uint256 _newRate) external {
        _checkOwner(); // Check if the caller is the owner
        rewardRate = _newRate;
    }

    /**
     * @dev Allows the owner to withdraw Ether from the contract's balance.
     * @param _amount The amount of Ether to withdraw.
     */
    function ownerWithdraw(uint256 _amount) external {
        _checkOwner(); // Private function call replaces onlyOwner modifier

        if (address(this).balance < _amount) {
            revert InsufficientAmount();
        }

        (bool success, ) = owner.call{value: _amount}("");
        require(success, "Failed to transfer Ether");
    }
}
