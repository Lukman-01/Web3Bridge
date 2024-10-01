// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract AreaOfShapes {
    
    /**
     * @dev Calculates the area of a square.
     * @param _length The length of one side of the square.
     * @return The area of the square, calculated as _length squared.
     */
    function areaOfSquare(uint _length) external pure returns (uint) {
        return _length ** 2;
    }

    /**
     * @dev Calculates the area of a rectangle.
     * @param _length The length of the rectangle.
     * @param _breath The breadth (width) of the rectangle.
     * @return The area of the rectangle, calculated as _length multiplied by _breath.
     */
    function areaOfRectangle(uint _length, uint _breath) external pure returns (uint) {
        return _length * _breath;
    }

    /**
     * @dev Calculates the area of a triangle.
     * @param _base The base of the triangle.
     * @param _height The height of the triangle.
     * @return The area of the triangle, calculated as (_base * _height) / 2.
     */
    function areaOfTriangle(uint _base, uint _height) external pure returns (uint) {
        return (_base * _height) / 2;
    }
}
