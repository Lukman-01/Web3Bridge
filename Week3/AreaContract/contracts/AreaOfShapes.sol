// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract AreaOfShapes {
    function areaOfSquare(uint16 _length) external pure returns(uint16){
        return _length**2;
    }

    function areaOfRectangle(uint16 _length, uint16 _breath) external pure returns(uint16){
        return _length * _breath;
    }

    function areaOfTriangle(uint16 _base, uint16 _height) external pure returns(uint16){
        return (_base * _height)/2;
    }
}
