// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

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

    // mapping is use in place of array in other to avoid array lenth check
    mapping(uint => Student) private students;

    // Custom Errors used in place of "required" statement for gas optimization
    error NotOwner();
    error NameRequired();
    error EmailRequired();
    error DOBRequired();
    error StudentNotFound();

    // events used in the smart contract
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

    function deleteStudent(uint _studentId) public onlyOwner {
        if (_studentId >= studentCount) {
            revert StudentNotFound();
        }

        delete students[_studentId];
        emit StudentDeleted(_studentId);
    }

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
