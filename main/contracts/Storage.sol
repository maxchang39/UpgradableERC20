pragma solidity ^0.4.24;

contract Storage {
//    KeyValueStorage public _storage;
    uint256 public _totalSupply;

    bool public _freeze;

    // Owner of this contract
    address public owner;

    mapping(address => bool) _blacklist;

    // Balances of accounts
    mapping(address => uint256) balances;

    // Amount allowed to transfer on behalf the owner
    mapping(address => mapping(address => uint256)) allowed;

}