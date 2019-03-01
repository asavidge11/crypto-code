const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require ('fs');
const solc = require('solc');

const provider = new HDWalletProvider(
  'axis image stuff divert pig deliver student exotic kiwi valid budget inquiry',
  'https://rinkeby.infura.io/v3/968c6521dde24878afeacd0cda5c4322'
)


const web3 = new Web3(provider);
const source = fs.readFileSync('contracts/lottery.sol', 'utf8');
const compiled = solc.compile(source, 1).contracts[':Lottery'];
const bytecode = '0x' + compiled.bytecode;
let inbox;
const deploy = async () => {
//   try {
      //get a list of all accounts=
    accounts = await web3.eth.getAccounts();
    console.log('here ',accounts);
    // Contract object
    const contract = await new web3.eth.Contract(JSON.parse(compiled.interface));
    //  .deploy({ data: bytecode, arguments: ['Hi there!'] })
    //    .send({ from: accounts[0] });
    console.log('here2');
    result = await contract.deploy({ data: bytecode})
    .send({ from: accounts[0], gas: '4000000'
        }, (err, txHash) => {
            console.log('send:', err, txHash);
        })
        .on('error', (err) => {
            console.log('error:', err);
        })
        .on('transactionHash', (err) => {
            console.log('transactionHash:', err);
        })
        .on('receipt', (receipt) => {
            console.log('receipt:', receipt);
        });


    console.log('here4');
    console.log(compiled.interface);
    console.log('Contract deployed to ', result.options.address);
    console.log('finished');
    process.exit(0);
//   }catch (err){
//     console.log(err);
//   }

};

deploy()
.then(() => console.log('Success'))
.catch(err => console.log('Script failed:', err));
