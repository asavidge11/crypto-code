const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require ('fs');
const solc = require('solc');
const provider = ganache.provider();
//const HDWalletProvider = require('truffle-hdwallet-provider');

//const provider = new HDWalletProvider(
//  "axis image stuff divert pig deliver student exotic kiwi valid budget inquiry",
//  "https://rinkeby.infura.io/v3/968c6521dde24878afeacd0cda5c4322"
//)
const web3 = new Web3(provider);
const source = fs.readFileSync('contracts/inbox.sol', 'utf8');
const compiled = solc.compile(source, 1).contracts[':Inbox'];


let accounts;
let inbox;

beforeEach(async ()=>{

  try {
      //get a list of all accounts=
    accounts = await web3.eth.getAccounts();

    //deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({data:compiled.bytecode, arguments: ['Hi there!']})
    .send({from: accounts[0], gas:'1000000'});
  }catch (err){
    console.log(err);
  }

});

describe('Inbox', () => {
  it('deploys a contract', ()=>{
    assert.ok(inbox.options.address);
  });
  it('It has a default message', async ()=>{
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi there!');
  });
  it('Can change the message', async ()=>{
    await inbox.methods.setMessage('bye').send({from:accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });

});
