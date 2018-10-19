pragma solidity ^0.4.24;

import "./Storage.sol";

contract TestTokenProxy is Storage {
    constructor(address _impl) public {
        impl = _impl;
        admin = msg.sender;
    }

    function implementation() public view returns (address){
        return impl;
    }

    function upgradeTo(address _impl) external returns (bool success){
        require(msg.sender == admin);
        require(_impl != address(0));

        impl = _impl;

        return true;
    }

    function() payable public {
        address _implementation = implementation();

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, _implementation, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 {revert(ptr, size)}
            default {return (ptr, size)}
        }
    }
}
