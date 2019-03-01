pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;

    function Lottery () public {
        manager = msg.sender;

    }
    //must send in Ether to enter the lottery, so must be payable
    function enter() public payable {
        //make sure that ether has been sent
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    //No real random number generator in Solidity, we are faking it here w/pseudo random number generator
    function random() private view returns (uint256){
        // use global function sha3
        //block - current block
        //now - current time
        return uint(keccak256(block.difficulty, now, players));

    }
    //use random() to select the winner
    function pickWinner() public managerOnly {
        uint index = random() % players.length;
        //send money to the winner
        players[index].transfer(this.balance);
        //reset contract to start fresh with no players
        players = new address[](0);

    }
    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }
    function getPlayers() public view returns (address[]){
        return players;
    }

}
