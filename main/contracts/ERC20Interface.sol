pragma solidity ^0.4.24;

interface ERC20Interface {
    // Get the total token supply
    function totalSupply() external view returns (uint256);

    // Get the account balance of _owner
    function balanceOf(address _owner) external view returns (uint256 balance);

    // transfer _amount from msg.sender to _to
    function transfer(address _to, uint256 _amount) external returns (bool success);

    // msg.sender transfer _amount from _from to _to on behalf of _from
    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool success);

    // Allow _spender to transfer _amount on behalf msg.sender
    function approve(address _spender, uint256 _amount) external returns (bool success);

    // Get the amount allowed to transfer through _spender on behalf of _owner
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    // Triggered when tokens are transferred.
    event Transfer(address indexed _from, address indexed _to, uint256 _amount);

    // Triggered whenever approve(address _spender, uint256 _amount) is called.
    event Approval(address indexed _owner, address indexed _spender, uint256 _amount);
}