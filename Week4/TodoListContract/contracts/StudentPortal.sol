// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract StudentPortal {
    address public owner;
    uint256 public studentCount;

    struct Student {
        uint16 dateOfBirth;
        string name;
        string email;
        string lga;
        string country;
        string state;
    }

    // mapping is used in place of array to avoid array length check
    mapping(uint => Student) private students;

    // Custom Errors used in place of "require" statement for gas optimization
    error NotOwner();
    error NameRequired();
    error EmailRequired();
    error DOBRequired();
    error StudentNotFound();

    // Events used in the smart contract
    event StudentCreated(uint indexed studentId, string indexed name, string email, string country);
    event StudentUpdated(uint indexed studentId, string indexed name, string email, string country);
    event StudentDeleted(uint studentId);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Registers a new student.
     * @param _dateOfBirth Date of birth of the student in uint16 format (e.g., 20010101 for January 1, 2001).
     * @param _name Name of the student.
     * @param _email Email of the student.
     * @param _lga Local Government Area (LGA) of the student.
     * @param _state State of the student.
     * @param _country Country of the student.
     * @return The student ID of the newly registered student.
     */
    function registerStudent(
        uint16 _dateOfBirth,
        string memory _name,
        string memory _email,
        string memory _lga,
        string memory _state,
        string memory _country
    ) public onlyOwner returns (uint) {
        if (bytes(_name).length == 0) {
            revert NameRequired();
        }
        if (bytes(_email).length == 0) {
            revert EmailRequired();
        }
        if (_dateOfBirth == 0) {
            revert DOBRequired();
        }

        Student storage newSt = students[studentCount];
        newSt.dateOfBirth = _dateOfBirth;
        newSt.name = _name;
        newSt.email = _email;
        newSt.lga = _lga;
        newSt.state = _state;
        newSt.country = _country;

        emit StudentCreated(studentCount, _name, _email, _country);
        return studentCount++;
    }

    /**
     * @dev Updates an existing student's details.
     * @param _studentId The ID of the student to update.
     * @param _dateOfBirth New date of birth of the student in uint16 format.
     * @param _name New name of the student.
     * @param _email New email of the student.
     * @param _lga New Local Government Area (LGA) of the student.
     * @param _state New state of the student.
     * @param _country New country of the student.
     */
    function updateStudent(
        uint _studentId,
        uint16 _dateOfBirth,
        string memory _name,
        string memory _email,
        string memory _lga,
        string memory _state,
        string memory _country
    ) public onlyOwner {
        if (_studentId >= studentCount) {
            revert StudentNotFound();
        }
        if (bytes(_name).length == 0) {
            revert NameRequired();
        }
        if (bytes(_email).length == 0) {
            revert EmailRequired();
        }
        if (_dateOfBirth == 0) {
            revert DOBRequired();
        }

        Student storage st = students[_studentId];
        st.dateOfBirth = _dateOfBirth;
        st.name = _name;
        st.email = _email;
        st.lga = _lga;
        st.state = _state;
        st.country = _country;

        emit StudentUpdated(_studentId, _name, _email, _country);
    }

    /**
     * @dev Deletes a student record.
     * @param _studentId The ID of the student to delete.
     */
    function deleteStudent(uint _studentId) public onlyOwner {
        if (_studentId >= studentCount) {
            revert StudentNotFound();
        }

        delete students[_studentId];
        emit StudentDeleted(_studentId);
    }

    /**
     * @dev Retrieves a student's details.
     * @param _studentId The ID of the student to retrieve.
     * @return name The name of the student.
     * @return email The email of the student.
     * @return dateOfBirth The date of birth of the student in uint16 format.
     * @return lga The Local Government Area (LGA) of the student.
     * @return country The country of the student.
     * @return state The state of the student.
     */
    function getStudent(uint _studentId)
        public
        view
        returns (
            string memory name,
            string memory email,
            uint16 dateOfBirth,
            string memory lga,
            string memory country,
            string memory state
        )
    {
        if (_studentId >= studentCount) {
            revert StudentNotFound();
        }

        Student storage st = students[_studentId];
        return (st.name, st.email, st.dateOfBirth, st.lga, st.country, st.state);
    }
}
