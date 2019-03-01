import Web3 from 'web3';

let web3;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
  //we are in browser and user has metamask
  web3 =  new Web3(window.web3.currentProvider);
} else {
     //We are on the server or not running metamask
     //create a new provider that connects to Rinkeby through Infura
     const provider = new Web3.providers.HttpProvider(
     //pass in url to infura node (see deploy.js)
      'https://rinkeby.infura.io/v3/968c6521dde24878afeacd0cda5c4322');
      web3 = new Web3(provider);
}



export default web3;
