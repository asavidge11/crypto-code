const path = require('path');
const fs = require ('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

//use solidity compiler
//console.log(solc.compile(source,1));
module.export= solc.compile(source,1).contracts[':Lottery'];
