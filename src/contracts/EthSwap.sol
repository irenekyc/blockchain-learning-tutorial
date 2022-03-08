pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  // uint means integer, cannot have decimal places nor negative value
  uint public rate = 100;
  
  // define the subscribe event
  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate    
  );

    // define the subscribe event
  event TokensSold(
    address account,
    address token,
    uint etherAmount,
    uint rate    
  );

  // Create a variable to represent the Token method
  Token public token;
  constructor(Token _token) public{
    token = _token;
  }


  // Buy Token function is to purchase Dapp token with ETH
  // need to add payable to this function in order to make this function "transferrable"
  function buyTokens() public payable{
    // msg is the global variable inside solidity (value is the value from global)
    // exchange rate / redemption rate
    // tokenAmount = Eth * exchange rate 
    uint tokenAmount = msg.value * rate;


    // require to check the balance of token (if they have stocks), similar to if else statement
    // only execute if there is enough token
    require(token.balanceOf(address(this))>=tokenAmount);

    // msg.sender is the address of the "user" who is calling this function
    token.transfer(msg.sender, tokenAmount);

    // subscribe to an event (track the event) - Emit an event 
    // similar concept to return something (you should be able to get from result.logs[0].args)
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  // Sell Token function is to sell Dapp Token to get Eth back
  function sellTokens(uint _amount) public {
    // stop user from selling more token than they have
    require(token.balanceOf(msg.sender) >= _amount);

    // calcaulate how much ether we have to give back to user
    uint etherAmount = _amount / rate;

    require(address(this).balance >= etherAmount);
    
    // we need to create an approve function for transferFrom
    token.transferFrom(msg.sender, address(this), _amount);

    // perform sale - send ether to user
    msg.sender.transfer(etherAmount);
    
    emit TokensPurchased(msg.sender, address(token), etherAmount, rate);
  }

}