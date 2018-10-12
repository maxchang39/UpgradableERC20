pragma solidity ^0.4.24;

import "./Storage.sol";

contract TestTokenProxy is Storage {
    // Owner of this contract
    address public admin;

    // The actual implementation address
    address private impl;

    constructor(address _impl) public {
        //        _storage.setAddress("impl", _impl);
        impl = _impl;
        admin = msg.sender;
    }

    function implementation() public view returns (address){
        //        return _storage.getAddress("impl");
        return impl;
    }


    function upgradeTo(address _impl) external returns (bool success){
        require(msg.sender == admin);

        //        _storage.setAddress("impl", _impl);
        impl = _impl;

        return true;
    }

    function() payable public {
        //        address _implementation = _storage.getAddress("impl");
        address _implementation = implementation();
        require(_implementation != address(0));

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
