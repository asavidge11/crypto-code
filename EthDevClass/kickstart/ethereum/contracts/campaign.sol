pragma solidity ^0.4.17;

contract CampaignFactory {
    // array of existing Deployed Campaigns
    address[] public deployedCampaigns;

    // exposed Factory function to create campaigns
    function createCampaign(string description, uint minimum) public {
        address newCampaign = new Campaign(description, minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    // exposed factory function to get deployed campaigns
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // struct of a campaign funding request
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        // contributor approvals for this campaign
        mapping(address => bool) approvals;
    }

    // array of funding requests
    Request[] public requests;
    // address of the account that manages the campaign
    address public manager;
    // description of the campaign
    string campaignDescription;
    // minimum contribution that users must meet to become approvers
    uint public minimumContribution;
    // map of the address and whether or not they are approvers
    mapping(address => bool) public approvers;
    // count of the number of approvers for a funding requests
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    // function to create the campaign
    function Campaign(string description, uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
        campaignDescription = description;
    }
    // function to contribute and donate to the campaign
    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }
    // Manager creates request to withdrawal money from campaign
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }
    // contributors to the campaign approve the managers request
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    // finalizing a funding request and transfer money to the campaign
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
    // get the state of campaign
    function getSummary() public view returns (
      string, uint, uint, uint, uint, address
      ) {
        return (
          campaignDescription,
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          manager
        );
    }
    // get the total number of requests made by the manager to fund the campaign
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
