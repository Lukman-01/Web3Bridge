// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SaveERC20 {
    address owner;
    address tokenAddress;
    mapping(address => uint256) balances;

    event DepositSuccessful(address indexed user, uint256 indexed amount);
    event WithdrawalSuccessful(address indexed user, uint256 indexed amount);
    event TransferSuccessful(address indexed from, address indexed _to, uint256 indexed amount);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "not owner");
        _;
    }


    function deposit(uint256 _amount) external {
        require(msg.sender != address(0), "zero addres detected");

        require(_amount > 0, "can't deposit zero");

        uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        require(_userTokenBalance >= _amount, "insufficient amount");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        balances[msg.sender] += _amount;

        emit DepositSuccessful(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender != address(0), "zero addres detected");
        require(_amount > 0, "can't deposit zero");

        uint256 _userBalance = balances[msg.sender];

        require(_amount <= _userBalance, "insufficient amount");

        balances[msg.sender] -= _amount;

        IERC20(tokenAddress).transfer(msg.sender, _amount);

        emit WithdrawalSuccessful(msg.sender, _amount);
    }

    function myBalance() external view returns(uint256) {
        return balances[msg.sender];
    }

    function getAnyBalance(address _user) external view onlyOwner returns(uint256) {
        return balances[_user];
    }

    function getContractBalance() external view onlyOwner returns(uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    function transferFunds(address _to, uint256 _amount) external {
        require(msg.sender != address(0), "zero address detected");

        require(_to != address(0), "can't send to");
        
        require(balances[msg.sender] >= _amount, "Insufficient funds!");

        balances[msg.sender] -= _amount;

        IERC20(tokenAddress).transfer(_to, _amount);

        emit TransferSuccessful(msg.sender, _to, _amount);
    }

    function depositForAnotherUserFromWithin(address _user, uint256 _amount) external {
        require(msg.sender != address(0), "zero address detected");
        require(_user != address(0), "can't send to");

        require(balances[msg.sender] >= _amount, "insufficent amount");

        balances[msg.sender] -= _amount;
        balances[_user] += _amount;
    }

    function depositForAnotherUser(address _user, uint256 _amount) external {
        require(msg.sender != address(0), "zero address detected");
        require(_user != address(0), "can't send to");


        uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        require(_userTokenBalance >= _amount, "insufficient amount");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        balances[_user] += _amount;
    }

    function ownerWithdraw(uint256 _amount) external onlyOwner {
        require(IERC20(tokenAddress).balanceOf(address(this)) >= _amount, "insufficient funds");

        IERC20(tokenAddress).transfer(owner, _amount);
    }
}