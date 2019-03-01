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
const source = fs.readFileSync('contracts/lottery.sol', 'utf8');
const compiled = solc.compile(source, 1).contracts[':Lottery'];


let accounts;
let lottery;

beforeEach(async ()=>{

  try {
      //get a list of all accounts=
    accounts = await web3.eth.getAccounts();

    //deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({data:compiled.bytecode})
    .send({from: accounts[0], gas:'1000000'});
  }catch (err){
    console.log(err);
  }

});

describe('Lottery', () => {
  it('deploys a contract', ()=>{
    assert.ok(lottery.options.address);
  });

  it('can enter lottery', async ()=>{
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from:accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });
  //multiple player test
  it('multiple accounts can enter', async ()=>{
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });
    const players = await lottery.methods.getPlayers().call({
      from:accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });
  //requires a minimum amount of ether to enter
  //negative test for failure of sending in 0 wei
  it('requires a minimum amount of ether to enter', async ()=>{
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      //fail test if we get to this place in the code
      assert(false);
    } catch (err){
      assert(err);
    }
  });
  //only manager can call pick winner
  it('only manager can call pick winner', async ()=>{
    try {
      await lottery.methods.pickwinner().send({
        //not the manager account
        from: accounts[1]
      });
      //fail test if we get to this place in the code
      assert(false);
    } catch (err){
      assert(err);
    }
  });
  //sends money to the winner and resets the array
  it('sends money to the winner and resets the array', async ()=>{
      await lottery.methods.enter().send({
        //not the manager account
        from: accounts[0],
        value: web3.utils.toWei('2', 'ether')
      });
      const initialBalance = await web3.eth.getBalance(accounts[0]);
      await lottery.methods.pickWinner().send({from:accounts[0]});
      const finalBalance = await web3.eth.getBalance(accounts[0]);
      const difference = finalBalance - initialBalance;
      console.log(difference);
      assert(difference >web3.utils.toWei('1.8','ether'));
  });
});
