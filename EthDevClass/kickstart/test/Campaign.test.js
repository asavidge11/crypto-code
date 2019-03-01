const assert  = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');


let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    try {
      factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({data: compiledFactory.bytecode})
      .send({from: accounts[0], gas:1000000});

      await factory.methods.createCampaign('100')
        .send({from:accounts[0], gas:1000000});

      //get first element in array - that is location of campaign address
      [campaignAddress] = await factory.methods.getDeployedCampaigns()
        .call();
      //get the campaign at the deployed address from the factory
      campaign = new web3.eth.Contract(JSON.parse(compiledCampaign.interface),campaignAddress);

  } catch (err){
    console.log("HERE ERROR ", err);
  }
});
describe('Campaigns', ()=>{
  it('Deploys a factory and a campaign',()=>{
     assert.ok(factory.options.address);
     assert.ok(campaign.options.address);
  });
  //make sure accounts[0] is the manager
  it('Person who calls create campaign on the factory is the manager',async ()=>{
     const manager = await campaign.methods.manager().call();
     assert.equal(accounts[0], manager);
  });
  //validate contributors are marked as approvers
  it('People can contribute and they are marked as approvers',async ()=>{
     const manager = await campaign.methods.contribute().send({
       value:'200',
       //use ganache test account[1] (of 10 test accounts on ganache) as test contributor
       from:accounts[1]
     });
     const isContributor = await campaign.methods.approvers(accounts[1]).call();
     assert(isContributor);
  });

  it('Requires a minimum contribution amount >100 wei', async ()=>{
    try {
      await campaign.methods.contribute().send({
        value:'5',
        //use ganache test account[1] (of 10 test accounts on ganache) as test contributor
        from:accounts[1]
      });
      assert(false);
    } catch (err ){
      assert(err);
    }
  });
  //allows a manager to create a payment request to the  vendor
  it('allows a manager to create a payment request to a vendor',async ()=>{
    await campaign.methods
      .createRequest('Buy batteries','100',accounts[1])
      .send({
          from: accounts[0],
          gas: '1000000'
      });
      const request = await campaign.methods.requests(0).call();
      assert.equal('Buy batteries', request.description);
    });

  //process an end to end request
  it('end to end request',async ()=>{
    //make manager contributor/approver
     await campaign.methods.contribute().send({
       value: web3.utils.toWei('3', 'ether'),
       from:accounts[0]});
     await campaign.methods
      .createRequest('A',web3.utils.toWei('1', 'ether'),accounts[1])
      .send({from: accounts[0],gas: '1000000'});
     await campaign.methods.approveRequest(0)
      .send({from: accounts[0],gas: '1000000'});
     await campaign.methods.finalizeRequest(0)
      .send({from: accounts[0],gas: '1000000'});
     let balance = await web3.eth.getBalance(accounts[1]);
     balance = web3.utils.fromWei(balance, 'ether');
     balance = parseFloat(balance);

     //for each ganache test run, balance is unclear
     //limitation of ganache - you would have to reinstall w/ default
     //amount of ether
     //ganache-cli --defaultBalanceEther 9000000000000000
     console.log(balance);
     assert (balance > 100);

  });
});
