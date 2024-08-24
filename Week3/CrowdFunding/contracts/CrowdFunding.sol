// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CrowdFunding {

    address public owner;
    uint256 public campaignCount;

    struct Campaign {
        string title;
        string description;
        address payable benefactor;
        uint goal;
        uint deadline;
        uint amountRaised;
        bool ended;
        mapping(address => uint) contributions; // Track individual contributions
    }

    mapping(uint => Campaign) public campaigns;

    // Custom Errors
    error NotOwner();
    error CallFailed();
    error CampaignEnd();
    error CampaignNotFound();
    error InvalidDonationAmount();
    error TitleRequired();
    error DescriptionRequired();
    error BenefactorAddressInvalid();
    error GoalMustBeGreaterThanZero();
    error RefundNotAllowed();

    event CampaignCreated(uint campaignId, string _title, string _description, uint _goal, uint _deadline);
    event DonationReceived(uint indexed campaignId, address indexed user, uint256 amount);
    event CampaignEnded(uint indexed campaignId, address indexed from, address indexed to, uint256 amount);
    event EtherWithdrawn(address indexed owner, uint amount);
    event RefundIssued(uint indexed campaignId, address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier campaignExists(uint campaignId) {
        if (campaignId >= campaignCount) {
            revert CampaignNotFound();
        }
        _;
    }

    modifier campaignActive(uint campaignId) {
        if (block.timestamp >= campaigns[campaignId].deadline || campaigns[campaignId].ended) {
            revert CampaignEnd();
        }
        _;
    }

    /**
     * @dev Creates a new fundraising campaign.
     * @param _title The title of the campaign.
     * @param _description A brief description of the campaign.
     * @param _benefactor The address of the campaign's benefactor who will receive the funds.
     * @param _goal The fundraising goal (in wei).
     * @param _durationInSeconds The duration of the campaign in seconds.
     * @return The ID of the newly created campaign.
     */
    function createCampaign(
        string calldata _title,
        string calldata _description,
        address payable _benefactor,
        uint _goal,
        uint _durationInSeconds
    ) external returns (uint) {

        if (bytes(_title).length == 0) {
            revert TitleRequired();
        }
        if (bytes(_description).length == 0) {
            revert DescriptionRequired();
        }
        if (_benefactor == address(0)) {
            revert BenefactorAddressInvalid();
        }
        if (_goal == 0) {
            revert GoalMustBeGreaterThanZero();
        }

        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.benefactor = _benefactor;
        newCampaign.goal = _goal;
        newCampaign.deadline = block.timestamp + _durationInSeconds;
        newCampaign.amountRaised = 0;
        newCampaign.ended = false;

        emit CampaignCreated(campaignCount, _title, _description, _goal, block.timestamp + _durationInSeconds);
        return campaignCount++;
    }

    /**
     * @dev Allows users to donate to an active campaign.
     * @param campaignId The ID of the campaign to donate to.
     */
    function donateToCampaign(uint campaignId) external payable campaignExists(campaignId) campaignActive(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        
        if (msg.value == 0) {
            revert InvalidDonationAmount();
        }

        campaign.amountRaised += msg.value;
        campaign.contributions[msg.sender] += msg.value;

        emit DonationReceived(campaignId, msg.sender, msg.value);
    }

    /**
     * @dev Ends a campaign and transfers the funds to the benefactor.
     * @param campaignId The ID of the campaign to end.
     */
    function endCampaign(uint campaignId) external campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        if (block.timestamp < campaign.deadline) {
            revert CampaignEnd(); // Reuse the CampaignEnded error for the timing check
        }
        if (campaign.ended) {
            revert CampaignEnd();
        }

        campaign.ended = true;
        (bool success, ) = campaign.benefactor.call{value: campaign.amountRaised}("");
        if (!success) {
            revert CallFailed();
        }

        emit CampaignEnded(campaignId, address(this), campaign.benefactor, campaign.amountRaised);
    }

    /**
     * @dev Allows users to claim a refund if the campaign did not meet its goal.
     * @param campaignId The ID of the campaign to claim a refund from.
     */
    function claimRefund(uint campaignId) external campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        if (block.timestamp < campaign.deadline || campaign.ended) {
            revert RefundNotAllowed();
        }
        uint contribution = campaign.contributions[msg.sender];
        if (contribution == 0) {
            revert InvalidDonationAmount();
        }

        campaign.contributions[msg.sender] = 0; // Prevent re-entrancy
        (bool success, ) = msg.sender.call{value: contribution}("");
        if (!success) {
            revert CallFailed();
        }

        emit RefundIssued(campaignId, msg.sender, contribution);
    }

    /**
     * @dev Allows the contract owner to withdraw Ether from the contract.
     * @param _amount The amount of Ether to withdraw.
     */
    function withdrawEther(uint _amount) external onlyOwner {
        if (address(this).balance < _amount) {
            revert CallFailed();
        }

        (bool success, ) = owner.call{value: _amount}("");
        if (!success) {
            revert CallFailed();
        }

        emit EtherWithdrawn(owner, _amount);
    }

    /**
     * @dev Fallback function to receive Ether.
     */
    receive() external payable {}

    /**
     * @dev Returns the contract's balance.
     * @return The amount of Ether held by the contract.
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
