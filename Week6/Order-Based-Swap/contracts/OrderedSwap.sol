// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OrderedSwap {
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

    uint256 noOfOrders;

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
    event OrderCreated(Order _order);
    event OrderFilled(address filler, Order _order);
    event OrderCancelled(Order _order);

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

        // Check if the require expected token address is a contract
        uint32 size;
        assembly {
            size := extcodesize(_tokenExpected)
        }
        if (size < 0) revert TokenAddressIsNotAContract();

        if (IERC20(_tokenDeposited).balanceOf(msg.sender) < _amountDeposited)
            revert InsufficientTokensFromSender();

        // deposit tokens into contract
        IERC20(_tokenDeposited).transferFrom(
            msg.sender,
            address(this),
            _amountDeposited
        );

        // create order
        ++noOfOrders;

        Order storage newOrder = orders[noOfOrders];

        newOrder.depositor = msg.sender;
        newOrder.amountDeposited = _amountDeposited;
        newOrder.tokenDeposited = _tokenDeposited;
        newOrder.tokenExpected = _tokenExpected;
        newOrder.amountExpected = _amountExpected;

        emit OrderCreated(newOrder);
    }

    function fillOrder(uint256 _orderId) external {
        // sanity checks
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed();

        Order storage orderToFill = orders[_orderId];
        if (orderToFill.depositor == address(0)) revert OrderDoesNotExist();
        if (msg.sender == orderToFill.depositor) revert OwnerCannotFillOrder();
        if (orderToFill.cancelled) revert OrderCancelledAlready();
        if (orderToFill.filled) revert OrderFilledAlready();

        // check balance of sender if sender has enough tokens to send
        if (
            IERC20(orderToFill.tokenExpected).balanceOf(msg.sender) <
            orderToFill.amountExpected
        ) revert InsufficientTokensFromSender();
        
        // update order details --prevent reentrancy
        orderToFill.filled = true;
        orderToFill.filler = msg.sender;

        // transfer tokens from sender to depositor
        IERC20(orderToFill.tokenExpected).transferFrom(
            msg.sender,
            orderToFill.depositor,
            orderToFill.amountExpected
        );

        // transfer tokens from contract to sender
        IERC20(orderToFill.tokenDeposited).transfer(
            msg.sender,
            orderToFill.amountDeposited
        );


        emit OrderFilled(msg.sender, orderToFill);
    }

    function cancelOrder(uint256 _orderId) external {
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed();
        Order storage orderToCancel = orders[_orderId];
        if (orderToCancel.depositor == address(0)) revert OrderDoesNotExist();
        if (msg.sender != orderToCancel.depositor)
            revert OnlyOwnerCanCancelOrder();
        if (orderToCancel.cancelled) revert OrderCancelledAlready();
        if (orderToCancel.filled) revert OrderFilledAlready();
        
        orderToCancel.cancelled = true; // prevent reentrancy

        IERC20(orderToCancel.tokenDeposited).transfer(
            orderToCancel.depositor,
            orderToCancel.amountDeposited
        );

        emit OrderCancelled(orderToCancel);
    }
}