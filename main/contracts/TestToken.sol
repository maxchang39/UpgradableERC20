pragma solidity ^0.4.24;

import "./Storage.sol";
import "./ERC20Interface.sol";
import "../lib/SafeMath.sol";

contract TestToken is ERC20Interface, Storage {
    using SafeMath for uint256;

    // Total amount of tokens
    uint256 public _totalSupply;

    // Flag for whether contract is locked
    bool public _freeze;

    // Owner of this contract
    address public owner;

    // List of blocked users
    mapping(address => bool) _blacklist;

    // Balances of accounts
    mapping(address => uint256) balances;

    // Amount allowed to transfer on behalf the owner
    mapping(address => mapping(address => uint256)) allowed;

    // Constructor
    constructor() public {
    }

    function initialize(uint256 totalSupply_) public returns (bool success){
        require(owner == address(0));

        owner = msg.sender;
        _totalSupply = totalSupply_;
        balances[owner] = _totalSupply;

        return true;
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
        require(_to != address(0));
        require(!_freeze);
        require(!_blacklist[_to] && !_blacklist[msg.sender]);
        require(balances[msg.sender] >= _amount);

        balances[msg.sender] = balances[msg.sender].sub(_amount);
        balances[_to] = balances[_to].add(_amount);

        emit Transfer(msg.sender, _to, _amount);

        return true;
    }

    // msg.sender transfer _amount from _from to _to on behalf of _from
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool success) {
        require(_to != address(0));
        require(!_freeze);
        require(!_blacklist[_from] && !_blacklist[_to] && !_blacklist[msg.sender]);
        require(balances[_from] >= _amount);
        require(allowed[_from][msg.sender] >= _amount);


        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_amount);

        balances[_from] = balances[_from].sub(_amount);
        balances[_to] = balances[_to].add(_amount);

        emit Transfer(_from, _to, _amount);

        return true;
    }

    // Transfer ownership to a new account
    function transferOwner(address _to) public returns (bool success){
        require(msg.sender == owner);
        require(!_blacklist[_to]);

        owner = _to;

        return true;
    }

    // Allow _spender to transfer _amount on behalf msg.sender
    function approve(address _spender, uint256 _amount) public returns (bool success) {
        require(!_blacklist[_spender] && !_blacklist[msg.sender]);

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

    // Black list _user from sending, receiving or allowing any token transfers
    function blacklist(address _user) public returns (bool success) {
        require(msg.sender == owner);

        _blacklist[_user] = true;

        return true;
    }
}
