// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.26;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract SaveERC20 {
//     address owner;
//     address tokenAddress;
//     mapping(address => uint256) balances;

//     // Custom errors for gas optimization
//     error NotOwner();
//     error ZeroAddressDetected();
//     error InsufficientAmount();
//     error CannotDepositZero();
//     error CannotSendTo();

//     event DepositSuccessful(address indexed user, uint256 indexed amount);
//     event WithdrawalSuccessful(address indexed user, uint256 indexed amount);
//     event TransferSuccessful(address indexed from, address indexed _to, uint256 indexed amount);

//     constructor(address _tokenAddress) {
//         owner = msg.sender;
//         tokenAddress = _tokenAddress;
//     }

//     /**
//      * @dev Checks if the caller is the owner.
//      * Replaces the `onlyOwner` modifier.
//      */
//     function _checkOwner() private view {
//         if (msg.sender != owner) {
//             revert NotOwner();
//         }
//     }

//     /**
//      * @dev Allows a user to deposit tokens into the contract.
//      * @param _amount The amount of tokens to deposit.
//      */
//     function deposit(uint256 _amount) external {
//         if (msg.sender == address(0)) {
//             revert ZeroAddressDetected();
//         }

//         if (_amount == 0) {
//             revert CannotDepositZero();
//         }

//         uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

//         if (_userTokenBalance < _amount) {
//             revert InsufficientAmount();
//         }

//         IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

//         balances[msg.sender] += _amount;

//         emit DepositSuccessful(msg.sender, _amount);
//     }

//     /**
//      * @dev Allows a user to withdraw tokens from the contract.
//      * @param _amount The amount of tokens to withdraw.
//      */
//     function withdraw(uint256 _amount) external {
//         if (msg.sender == address(0)) {
//             revert ZeroAddressDetected();
//         }

//         if (_amount == 0) {
//             revert CannotDepositZero();
//         }

//         uint256 _userBalance = balances[msg.sender];

//         if (_amount > _userBalance) {
//             revert InsufficientAmount();
//         }

//         balances[msg.sender] -= _amount;

//         IERC20(tokenAddress).transfer(msg.sender, _amount);

//         emit WithdrawalSuccessful(msg.sender, _amount);
//     }

//     /**
//      * @dev Retrieves the balance of the caller.
//      * @return The balance of the caller.
//      */
//     function myBalance() external view returns(uint256) {
//         return balances[msg.sender];
//     }

//     /**
//      * @dev Retrieves the balance of a specified user.
//      * @param _user The address of the user to retrieve the balance for.
//      * @return The balance of the specified user.
//      */
//     function getAnyBalance(address _user) external view returns(uint256) {
//         _checkOwner(); // Private function call replaces onlyOwner modifier
//         return balances[_user];
//     }

//     /**
//      * @dev Retrieves the token balance held by the contract.
//      * @return The token balance of the contract.
//      */
//     function getContractBalance() external view returns(uint256) {
//         _checkOwner(); // Private function call replaces onlyOwner modifier
//         return IERC20(tokenAddress).balanceOf(address(this));
//     }

//     /**
//      * @dev Transfers tokens from the caller to another address.
//      * @param _to The address to transfer tokens to.
//      * @param _amount The amount of tokens to transfer.
//      */
//     function transferFunds(address _to, uint256 _amount) external {
//         if (msg.sender == address(0)) {
//             revert ZeroAddressDetected();
//         }

//         if (_to == address(0)) {
//             revert CannotSendTo();
//         }
        
//         if (balances[msg.sender] < _amount) {
//             revert InsufficientAmount();
//         }

//         balances[msg.sender] -= _amount;

//         IERC20(tokenAddress).transfer(_to, _amount);

//         emit TransferSuccessful(msg.sender, _to, _amount);
//     }

//     /**
//      * @dev Deposits tokens from the caller's balance to another user's balance within the contract.
//      * @param _user The address of the user to deposit tokens for.
//      * @param _amount The amount of tokens to deposit.
//      */
//     function depositForAnotherUserFromWithin(address _user, uint256 _amount) external {
//         if (msg.sender == address(0)) {
//             revert ZeroAddressDetected();
//         }

//         if (_user == address(0)) {
//             revert CannotSendTo();
//         }

//         if (balances[msg.sender] < _amount) {
//             revert InsufficientAmount();
//         }

//         balances[msg.sender] -= _amount;
//         balances[_user] += _amount;
//     }

//     /**
//      * @dev Deposits tokens from the caller's external wallet to another user's balance within the contract.
//      * @param _user The address of the user to deposit tokens for.
//      * @param _amount The amount of tokens to deposit.
//      */
//     function depositForAnotherUser(address _user, uint256 _amount) external {
//         if (msg.sender == address(0)) {
//             revert ZeroAddressDetected();
//         }

//         if (_user == address(0)) {
//             revert CannotSendTo();
//         }

//         uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

//         if (_userTokenBalance < _amount) {
//             revert InsufficientAmount();
//         }

//         IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

//         balances[_user] += _amount;
//     }

//     /**
//      * @dev Allows the owner to withdraw tokens from the contract's balance.
//      * @param _amount The amount of tokens to withdraw.
//      */
//     function ownerWithdraw(uint256 _amount) external {
//         _checkOwner(); // Private function call replaces onlyOwner modifier

//         if (IERC20(tokenAddress).balanceOf(address(this)) < _amount) {
//             revert InsufficientAmount();
//         }

//         IERC20(tokenAddress).transfer(owner, _amount);
//     }
// }


pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract SaveERC20 {
    error AddressZeroDetected();
    error ZeroValueNotAllowed();
    error CantSendToZeroAddress();
    error InsufficientFunds();
    error NotOwner();
    error InsufficientContractBalance();


    address public owner;
    address public tokenAddress;
    mapping(address => uint256) balances;

    event DepositSuccessful(address indexed user, uint256 indexed amount);
    event WithdrawalSuccessful(address indexed user, uint256 indexed amount);
    event TransferSuccessful(address indexed from, address indexed _to, uint256 indexed amount);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }


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

    function myBalance() external view returns(uint256) {
        return balances[msg.sender];
    }

    function getAnyBalance(address _user) external view returns(uint256) {
        onlyOwner();
        return balances[_user];
    }

    function getContractBalance() external view returns(uint256) {
        onlyOwner();
        return IERC20(tokenAddress).balanceOf(address(this));
    }

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

    function ownerWithdraw(uint256 _amount) external {
        onlyOwner();

        if(_amount > IERC20(tokenAddress).balanceOf(address(this))) {
            revert InsufficientContractBalance();
        }

        IERC20(tokenAddress).transfer(owner, _amount);
    }

    function onlyOwner() private view {
        if(msg.sender != owner) {
            revert NotOwner();
        }
    }
}