# Upgradable ERC20
An Upgradable ERC20 Token with a couple advanced features.

# Background

ERC20

* https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
* https://theethereum.wiki/w/index.php/ERC20_Token_Standard

SafeMath
* https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol

Proxy
* https://blog.zeppelinos.org/proxy-patterns/

# Features
* The token contract has an owner that is initially set to the address that created the contract.
* The owner can transfer ownership of the contract to a different address.
* The owner can temporarily pause all token transfers.
* The owner can blacklist a specific address thus preventing it from sending, receiving, or allowing any token transfers.
* The owner can upgrade the contract to a new implementation without losing any token data (e.g. balances, allowances, etc).

# Environment
* Solidity 0.4.24
* Python 2.7
* Ganache CLI v6.1.8 (ganache-core: 2.2.1)
* Truffle v4.1.14

# Testing
First cmd prompt
* vagrant up
* vagrant ssh
* ganache-cli

Second cmd prompt
* vagrant up
* vagrant ssh
* npm install --save-dev solidity-coverage
* cd UpgradableERC20/main/
* ../../node_modules/.bin/solidity-coverage

# Test Coverage
100% branch, 100% line

# Deployment
Please follow web3 documentation at: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#deploy