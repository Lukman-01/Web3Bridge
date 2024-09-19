// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol"; // For contract address check

contract OrderedSwap {
    using Address for address;

    struct Order {
        address depositor;
        address filler;
        bool cancelled;
        bool filled;
        address tokenDeposited;
        uint256 amountDeposited;
        address tokenExpected;
        uint256 amountExpected;
    }

    uint256 public noOfOrders;
    mapping(uint256 => Order) public orders;

    // errors
    error ZeroAddressNotAllowed();
    error ZeroAmountNotAllowed();
    error OrderFilledAlready();
    error OrderCancelledAlready();
    error InsufficientTokensFromSender();
    error TokenAddressIsNotAContract();
    error OrderDoesNotExist();
    error OnlyOwnerCanCancelOrder();
    error OwnerCannotFillOrder();

    // events
    event OrderCreated(
        uint256 indexed orderId,
        address indexed depositor,
        address indexed tokenDeposited,
        uint256 amountDeposited,
        address tokenExpected,
        uint256 amountExpected
    );
    event OrderFilled(address indexed filler, uint256 indexed orderId);
    event OrderCancelled(uint256 indexed orderId);

    // Create an order
    function createOrder(
        address _tokenDeposited,
        uint256 _amountDeposited,
        address _tokenExpected,
        uint256 _amountExpected
    ) external {
        // checks
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed();
        if (_tokenDeposited == address(0)) revert ZeroAddressNotAllowed();
        if (_tokenExpected == address(0)) revert ZeroAddressNotAllowed();
        if (_amountDeposited <= 0) revert ZeroAmountNotAllowed();

        // Ensure tokenExpected is a contract
        if (!_tokenExpected.isContract()) revert TokenAddressIsNotAContract();

        if (IERC20(_tokenDeposited).balanceOf(msg.sender) < _amountDeposited)
            revert InsufficientTokensFromSender();

        // Transfer tokens from the depositor to the contract
        IERC20(_tokenDeposited).transferFrom(
            msg.sender,
            address(this),
            _amountDeposited
        );

        // Create the order
        ++noOfOrders;
        orders[noOfOrders] = Order({
            depositor: msg.sender,
            filler: address(0),
            cancelled: false,
            filled: false,
            tokenDeposited: _tokenDeposited,
            amountDeposited: _amountDeposited,
            tokenExpected: _tokenExpected,
            amountExpected: _amountExpected
        });

        emit OrderCreated(
            noOfOrders,
            msg.sender,
            _tokenDeposited,
            _amountDeposited,
            _tokenExpected,
            _amountExpected
        );
    }

    // Fill an order
    function fillOrder(uint256 _orderId) external {
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed();

        Order storage orderToFill = orders[_orderId];
        if (orderToFill.depositor == address(0)) revert OrderDoesNotExist();
        if (msg.sender == orderToFill.depositor) revert OwnerCannotFillOrder();
        if (orderToFill.cancelled) revert OrderCancelledAlready();
        if (orderToFill.filled) revert OrderFilledAlready();

        if (IERC20(orderToFill.tokenExpected).balanceOf(msg.sender) < orderToFill.amountExpected)
            revert InsufficientTokensFromSender();

        // Transfer expected tokens from the filler to the depositor
        IERC20(orderToFill.tokenExpected).transferFrom(
            msg.sender,
            orderToFill.depositor,
            orderToFill.amountExpected
        );

        // Transfer deposited tokens from the contract to the filler
        IERC20(orderToFill.tokenDeposited).transfer(
            msg.sender,
            orderToFill.amountDeposited
        );

        // Mark order as filled
        orderToFill.filled = true;
        orderToFill.filler = msg.sender;

        emit OrderFilled(msg.sender, _orderId);
    }

    // Cancel an order
    function cancelOrder(uint256 _orderId) external {
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed();

        Order storage orderToCancel = orders[_orderId];
        if (orderToCancel.depositor == address(0)) revert OrderDoesNotExist();
        if (msg.sender != orderToCancel.depositor) revert OnlyOwnerCanCancelOrder();
        if (orderToCancel.cancelled) revert OrderCancelledAlready();
        if (orderToCancel.filled) revert OrderFilledAlready();

        // Return deposited tokens to the depositor
        IERC20(orderToCancel.tokenDeposited).transfer(
            orderToCancel.depositor,
            orderToCancel.amountDeposited
        );

        orderToCancel.cancelled = true;

        emit OrderCancelled(_orderId);
    }
}

