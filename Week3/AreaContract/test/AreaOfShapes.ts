import { expect } from "chai";
import { ethers } from "hardhat";

describe("AreaOfShapes", function () {
  let AreaOfShapes: any;
  let areaOfShapes: any;

  // This hook runs before each test case, deploying a new instance of the AreaOfShapes contract
  beforeEach(async function () {
    // Get the contract factory for AreaOfShapes
    AreaOfShapes = await ethers.getContractFactory("AreaOfShapes");
    
    // Deploy a new instance of the AreaOfShapes contract
    areaOfShapes = await AreaOfShapes.deploy();
  });

  // Test case to check if the areaOfSquare function calculates the area of a square correctly
  it("should calculate the area of a square correctly", async function () {
    const length = 5; // The length of one side of the square
    const expectedArea = length ** 2; // The expected area of the square (length^2)

    // Call the areaOfSquare function and store the result
    const result = await areaOfShapes.areaOfSquare(length);

    // Assert that the result matches the expected area
    expect(result).to.equal(expectedArea);
  });

  // Test case to check if the areaOfRectangle function calculates the area of a rectangle correctly
  it("should calculate the area of a rectangle correctly", async function () {
    const length = 5; // The length of the rectangle
    const breadth = 10; // The breadth (width) of the rectangle
    const expectedArea = length * breadth; // The expected area of the rectangle (length * breadth)

    // Call the areaOfRectangle function and store the result
    const result = await areaOfShapes.areaOfRectangle(length, breadth);

    // Assert that the result matches the expected area
    expect(result).to.equal(expectedArea);
  });

  // Test case to check if the areaOfTriangle function calculates the area of a triangle correctly
  it("should calculate the area of a triangle correctly", async function () {
    const base = 5; // The base of the triangle
    const height = 10; // The height of the triangle
    const expectedArea = (base * height) / 2; // The expected area of the triangle ((base * height) / 2)

    // Call the areaOfTriangle function and store the result
    const result = await areaOfShapes.areaOfTriangle(base, height);

    // Assert that the result matches the expected area
    expect(result).to.equal(expectedArea);
  });
});
