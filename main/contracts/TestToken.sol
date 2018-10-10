pragma solidity ^0.4.24;
import "./UpgradableERC20.sol";
import "./lib/math/SafeMath.sol";

contract TestToken is UpgradableERC20 {
    using SafeMath for uint256;

    uint256 _totalSupply = 10000;

    bool _freeze = false;

    // Owner of this contract
    address public owner;

    // Balances of accounts
    mapping(address => uint256) balances;

    // Amount allowed to transfer on behalf the owner
    mapping(address => mapping (address => uint256)) allowed;

    // Constructor
    constructor() public {
        owner = msg.sender;
        balances[owner] = _totalSupply;
    }

    // Get the total token supply
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // Get the account balance of _owner
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    // transfer _amount from msg.sender to _to
    function transfer(address _to, uint256 _amount) public returns (bool success) {
        require(!_freeze);
        require(balances[msg.sender] >= _amount);
        require(_to!=0);

        balances[msg.sender] = balances[msg.sender].sub(_amount);
        balances[_to] = balances[_to].add(_amount);

        return true;
    }

    // msg.sender transfer _amount from _from to _to on behalf of _from
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool success) {
        require(!_freeze);
        require(balances[_from] >= _amount);
        require(allowed[_from][msg.sender] >= _amount);
        require(_to!=0);

        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_amount);

        balances[_from] = balances[_from].sub(_amount);
        balances[_to] = balances[_to].add(_amount);

        return true;
    }

    // Transfer ownership to a new account
    function transferOwner(address _to) public returns (bool success){
        require(msg.sender == owner);
        owner = _to;

        return true;
    }

    // Allow _spender to transfer _amount on behalf msg.sender
    function approve(address _spender, uint256 _amount) public returns (bool success) {
        allowed[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    // Get the amount allowed to transfer through _spender on behalf of _owner
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    // Freeze and block new transfers
    function freeze() public returns (bool success) {
        require(msg.sender == owner);

        _freeze = true;

        return true;
    }

    // Unfreeze and allow new transfers
    function unfreeze() public returns (bool success) {
        require(msg.sender == owner);

        _freeze = false;

        return true;
    }
}
