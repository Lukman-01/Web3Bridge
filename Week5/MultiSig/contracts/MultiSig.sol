// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MultiSig {
    uint8 public quorum;
    uint8 public noOfValidSigners;
    uint256 public txCount;
    
    struct Transaction {
        uint256 id;
        uint256 amount;
        address sender;
        address recipient;
        bool isCompleted;
        uint256 timestamp;
        uint256 noOfApproval;
        address tokenAddress;
        address[] transactionSigners;
    }

    struct QuorumUpdateProposal {
        uint8 newQuorum;
        uint256 approvals;
        bool isExecuted;
        address proposer;
        address[] approvers;
        mapping(address => bool) hasApproved;
    }

    mapping(address => bool) isValidSigner;
    mapping(uint => Transaction) transactions; // txId -> Transaction
    mapping(uint256 => QuorumUpdateProposal) public QuorumUpdateProposals; // proposalId -> QuorumUpdateProposal
    mapping(address => mapping(uint256 => bool)) hasSigned; // signer -> transactionId -> bool (checking if an address has signed)

    uint256 public quorumProposalCount;

    constructor(uint8 _quorum, address[] memory _validSigners) {
        require(_validSigners.length > 1, "few valid signers");
        require(_quorum > 1, "quorum is too small");

        for(uint256 i = 0; i < _validSigners.length; i++) {
            require(_validSigners[i] != address(0), "zero address not allowed");
            require(!isValidSigner[_validSigners[i]], "signer already exists");

            isValidSigner[_validSigners[i]] = true;
        }

        noOfValidSigners = uint8(_validSigners.length);

        if (!isValidSigner[msg.sender]) {
            isValidSigner[msg.sender] = true;
            noOfValidSigners += 1;
        }

        require(_quorum <= noOfValidSigners, "quorum greater than valid signers");
        quorum = _quorum;
    }

    function transfer(uint256 _amount, address _recipient, address _tokenAddress) external {
        require(msg.sender != address(0), "address zero found");
        require(isValidSigner[msg.sender], "invalid signer");

        require(_amount > 0, "can't send zero amount");
        require(_recipient != address(0), "address zero found");
        require(_tokenAddress != address(0), "address zero found");

        require(IERC20(_tokenAddress).balanceOf(address(this)) >= _amount, "insufficient funds");

        uint256 _txId = txCount + 1;
        Transaction storage trx = transactions[_txId];

        trx.id = _txId;
        trx.amount = _amount;
        trx.recipient = _recipient;
        trx.sender = msg.sender;
        trx.timestamp = block.timestamp;
        trx.tokenAddress = _tokenAddress;
        trx.noOfApproval += 1;
        trx.transactionSigners.push(msg.sender);
        hasSigned[msg.sender][_txId] = true;

        txCount += 1;
    }

    function approveTx(uint8 _txId) external {
        Transaction storage trx = transactions[_txId];

        require(trx.id != 0, "invalid tx id");

        require(IERC20(trx.tokenAddress).balanceOf(address(this)) >= trx.amount, "insufficient funds");
        require(!trx.isCompleted, "transaction already completed");
        require(trx.noOfApproval < quorum, "approvals already reached");

        require(isValidSigner[msg.sender], "not a valid signer");
        require(!hasSigned[msg.sender][_txId], "can't sign twice");

        hasSigned[msg.sender][_txId] = true;
        trx.noOfApproval += 1;
        trx.transactionSigners.push(msg.sender);

        if(trx.noOfApproval == quorum) {
            trx.isCompleted = true;
            IERC20(trx.tokenAddress).transfer(trx.recipient, trx.amount);
        }
    }

    // Function to propose and approve quorum update
    function proposeAndApproveQuorum(uint8 _newQuorum) external {
        require(isValidSigner[msg.sender], "not a valid signer");
        require(_newQuorum > 1, "invalid quorum");
        require(_newQuorum <= noOfValidSigners, "invalid quorum");

        // Check if a proposal already exists
        QuorumUpdateProposal storage proposal = QuorumUpdateProposals[quorumProposalCount];

        // If no proposal exists or it has been executed, create a new one
        if (proposal.proposer == address(0) || proposal.isExecuted) {
            quorumProposalCount++;
            proposal = QuorumUpdateProposals[quorumProposalCount];
            proposal.newQuorum = _newQuorum;
            proposal.proposer = msg.sender;
            proposal.approvals = 1;
            proposal.approvers.push(msg.sender);
            proposal.hasApproved[msg.sender] = true;
        } else {
            // Approve the existing proposal
            require(!proposal.hasApproved[msg.sender], "already approved");

            proposal.approvals++;
            proposal.approvers.push(msg.sender);
            proposal.hasApproved[msg.sender] = true;

            // Once approvals reach quorum, update the quorum
            if (proposal.approvals >= quorum) {
                proposal.isExecuted = true;
                quorum = proposal.newQuorum;
            }
        }
    }
}
