// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingContract {
    address public owner;
    address public tokenAddress;
    uint256 public rewardRate; // Reward rate in percentage per day
    mapping(address => Stake) private stakes;
    mapping(address => uint256) private balances;

    // Custom errors for gas optimization
    error NotOwner();
    error ZeroAddressDetected();
    error InsufficientAmount();
    error CannotDepositZero();
    error CannotSendTo();
    error NoStakes();

    event DepositSuccessful(address indexed user, uint256 indexed amount);
    event WithdrawalSuccessful(address indexed user, uint256 indexed amount);
    event Staked(address indexed user, uint256 indexed amount, uint256 indexed timestamp);
    event RewardWithdrawn(address indexed user, uint256 indexed amount);
    event TransferSuccessful(address indexed sender, address indexed to, uint indexed amount);

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 reward;
    }

    /**
     * @dev Initializes the contract, setting the deployer as the owner and assigning the token address.
     * @param _tokenAddress The address of the ERC20 token contract.
     * @param _rewardRate The initial reward rate (e.g., 1 for 1% per day).
     */
    constructor(address _tokenAddress, uint256 _rewardRate) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
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
     * @dev Allows a user to deposit tokens into the contract and stake them.
     * @param _amount The amount of tokens to deposit and stake.
     */
    function stake(uint256 _amount) external {
        if (msg.sender == address(0)) {
            revert ZeroAddressDetected();
        }

        if (_amount == 0) {
            revert CannotDepositZero();
        }

        uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        if (_userTokenBalance < _amount) {
            revert InsufficientAmount();
        }

        // Transfer tokens from user to contract
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        // Record the stake
        Stake storage userStake = stakes[msg.sender];
        userStake.amount += _amount;
        userStake.startTime = block.timestamp;

        emit Staked(msg.sender, _amount, block.timestamp);
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
     * @dev Allows a user to withdraw their staked tokens and rewards.
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

        userStake.amount = 0; // Reset the staked amount
        userStake.reward = 0; // Reset the reward

        // Transfer staked amount + reward back to the user
        IERC20(tokenAddress).transfer(msg.sender, stakedAmount + reward);

        emit WithdrawalSuccessful(msg.sender, stakedAmount + reward);
    }

    /**
     * @dev Retrieves the balance of the caller (non-staked balance).
     * @return The balance of the caller.
     */
    function myBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    /**
     * @dev Retrieves the balance of a specified user.
     * @param _user The address of the user to retrieve the balance for.
     * @return The balance of the specified user.
     */
    function getAnyBalance(address _user) external view returns (uint256) {
        _checkOwner(); // Private function call replaces onlyOwner modifier
        return balances[_user];
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
     * @dev Retrieves the token balance held by the contract.
     * @return The token balance of the contract.
     */
    function getContractBalance() external view returns (uint256) {
        _checkOwner(); // Private function call replaces onlyOwner modifier
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    /**
     * @dev Transfers tokens from the caller to another address.
     * @param _to The address to transfer tokens to.
     * @param _amount The amount of tokens to transfer.
     */
    function transferFunds(address _to, uint256 _amount) external {
        if (msg.sender == address(0)) {
            revert ZeroAddressDetected();
        }

        if (_to == address(0)) {
            revert CannotSendTo();
        }

        if (balances[msg.sender] < _amount) {
            revert InsufficientAmount();
        }

        balances[msg.sender] -= _amount;

        IERC20(tokenAddress).transfer(_to, _amount);

        emit TransferSuccessful(msg.sender, _to, _amount);
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
     * @dev Allows the owner to withdraw tokens from the contract's balance.
     * @param _amount The amount of tokens to withdraw.
     */
    function ownerWithdraw(uint256 _amount) external {
        _checkOwner(); // Private function call replaces onlyOwner modifier

        if (IERC20(tokenAddress).balanceOf(address(this)) < _amount) {
            revert InsufficientAmount();
        }

        IERC20(tokenAddress).transfer(owner, _amount);
    }
}
