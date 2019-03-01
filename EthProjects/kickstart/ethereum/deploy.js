// deploy to Rinkeby
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require ('fs');
const solc = require('solc');

const provider = new HDWalletProvider(
  'axis image stuff divert pig deliver student exotic kiwi valid budget inquiry',
  'https://rinkeby.infura.io/v3/968c6521dde24878afeacd0cda5c4322'
)


const web3 = new Web3(provider);
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');


const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: "0x" + compiledFactory.bytecode })
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

  console.log('Contract deployed to', result.options.address);
};
deploy();
