//Export instance of Campaign Factory
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

//Get access to deployed Campaign CampaignFactory
const instance = new web3.eth.Contract (
     JSON.parse(CampaignFactory.interface),
   '0x78C59f8E97Fa7B3BA9bB123D56B165A522c0Db29'
);

export default instance;
