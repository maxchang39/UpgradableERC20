pragma solidity ^0.4.24;

import "./ERC20Interface.sol";
import "./lib/math/SafeMath.sol";
import "./TestToken.sol";

// Test Token Version 2
contract TestTokenV2 is TestToken {
    // transfer _amount from msg.sender to _to, only transfer 1 token
    function transfer(address _to, uint256 _amount) public returns (bool success) {
        require(_to != address(0));
        require(!_freeze);
        require(!_blacklist[_to] && !_blacklist[msg.sender]);
        // dummy logic here just for testing the proxy
        require(balances[msg.sender] >= 1 || balances[msg.sender] >= _amount);

        balances[msg.sender] = balances[msg.sender].sub(1);
        balances[_to] = balances[_to].add(1);

        return true;
    }
}