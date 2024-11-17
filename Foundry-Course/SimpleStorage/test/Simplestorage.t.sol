// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "forge-std/Test.sol";
import "../src/SimpleStorage.sol";

contract SimpleStorageTest is Test {
    SimpleStorage public simpleStorage;

    function setUp() public {
        // Deploy the contract
        simpleStorage = new SimpleStorage();
    }

    function testStoreAndRetrieve() public {
        // Test the `store` function
        uint256 testFavoriteNumber = 42;
        simpleStorage.store(testFavoriteNumber);

        // Assert that the `retrieve` function returns the correct value
        uint256 retrievedNumber = simpleStorage.retrieve();
        assertEq(retrievedNumber, testFavoriteNumber, "Stored value does not match retrieved value");
    }

    function testAddPerson() public {
        // Test the `addPerson` function
        string memory testName = "Alice";
        uint256 testFavoriteNumber = 7;

        simpleStorage.addPerson(testName, testFavoriteNumber);

        // Assert that the person was added correctly
        (uint256 favoriteNumber, string memory name) = simpleStorage.listOfPeople(0);
        assertEq(favoriteNumber, testFavoriteNumber, "Favorite number does not match");
        assertEq(name, testName, "Name does not match");

        // Assert that the mapping was updated correctly
        uint256 mappedFavoriteNumber = simpleStorage.nameToFavoriteNumber(testName);
        assertEq(mappedFavoriteNumber, testFavoriteNumber, "Mapping does not contain correct favorite number");
    }

    function testStoreAndRetrieveWithMultipleValues() public {
        // Store a few values and ensure the latest one is retrieved
        simpleStorage.store(10);
        assertEq(simpleStorage.retrieve(), 10, "First stored value mismatch");

        simpleStorage.store(20);
        assertEq(simpleStorage.retrieve(), 20, "Second stored value mismatch");
    }

    function testAddMultiplePeople() public {
        // Add multiple people
        simpleStorage.addPerson("Bob", 15);
        simpleStorage.addPerson("Charlie", 25);

        // Check the first person
        (uint256 favNumBob, string memory nameBob) = simpleStorage.listOfPeople(0);
        assertEq(favNumBob, 15, "Bob's favorite number mismatch");
        assertEq(nameBob, "Bob", "Bob's name mismatch");

        // Check the second person
        (uint256 favNumCharlie, string memory nameCharlie) = simpleStorage.listOfPeople(1);
        assertEq(favNumCharlie, 25, "Charlie's favorite number mismatch");
        assertEq(nameCharlie, "Charlie", "Charlie's name mismatch");

        // Validate mapping
        assertEq(simpleStorage.nameToFavoriteNumber("Bob"), 15, "Bob's mapping mismatch");
        assertEq(simpleStorage.nameToFavoriteNumber("Charlie"), 25, "Charlie's mapping mismatch");
    }
}
