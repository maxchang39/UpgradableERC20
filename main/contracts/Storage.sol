pragma solidity ^0.4.24;

contract Storage {
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

}