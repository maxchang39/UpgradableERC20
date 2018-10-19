var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - freeze contract', function (accounts) {
    it("Freeze contract Test", function (done) {
        var logInitialize = function (action) {
            console.log("    [Log]Attempt to initialize proxy, Expected " + action.succeed);
        }

        var logTransfer = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                accounts.indexOf(action.account) + " to account " + accounts.indexOf(action.to) +
                ", Expected " + action.succeed);
        }

        var logTransferFrom = function (action) {
            console.log("    [Log]Attempt to transfer " + accounts.indexOf(action.amount) + " from account " +
                accounts.indexOf(action.from) + " to account " + accounts.indexOf(action.to) + " through account " +
                accounts.indexOf(action.account) + ", Expected " + action.succeed);
        }

        var logFreeze = function (action) {
            console.log("    [Log]Attempt to freeze the contract, Expected " + action.succeed);
        }

        var logUnfreeze = function (action) {
            console.log("    [Log]Attempt to unfreeze the contract, Expected " + action.succeed);
        }

        var printAccount = function (action, result, expected) {
            var line = "    The balance of account " + accounts.indexOf(action.owner) +
                " is " + result.toString();
            if (expected != null)
                line += ", expected " + expected;
            console.log(line);
        }

        counter.reset();

        run(accounts, done, {
            type: "erc",
            actions: [
                {
                    block: counter.increment(),
                    action: "initialize",
                    totalSupply: 10000,
                    account: accounts[0],
                    succeed: true,
                    post: logInitialize,
                    on_error: "Failed to initialize proxy"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[0],
                    succeed: true,
                    result: 10000,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[1],
                    succeed: true,
                    result: 0,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
                {
                    block: counter.increment(),
                    action: "freeze",
                    account: accounts[1],
                    log: logFreeze,
                    succeed: false,
                    on_error: "No account should be able to freeze the contract other than owner",
                },
                {
                    block: counter.increment(),
                    action: "freeze",
                    account: accounts[0],
                    log: logFreeze,
                    succeed: true,
                    on_error: "Failed to freeze the contract",
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: accounts[0],
                    to: accounts[1],
                    amount: 450,
                    log: logTransfer,
                    succeed: false,
                    on_error: "Transfer should fail when the contract is freeze."
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: accounts[1],
                    from: accounts[0],
                    to: accounts[1],
                    amount: 200,
                    log: logTransferFrom,
                    succeed: false,
                    on_error: "TransferFrom should fail when the contract is freeze."
                },
                {
                    block: counter.increment(),
                    action: "unfreeze",
                    account: accounts[1],
                    log: logUnfreeze,
                    succeed: false,
                    on_error: "No account should be able to unfreeze the contract other than owner",
                },
                {
                    block: counter.increment(),
                    action: "unfreeze",
                    account: accounts[0],
                    log: logUnfreeze,
                    succeed: true,
                    on_error: "Failed to unfreeze the contract",
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: accounts[0],
                    to: accounts[1],
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "Failed to transfer balance after unfreeze."
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[0],
                    succeed: true,
                    result: 9550,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[1],
                    succeed: true,
                    result: 450,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
            ]
        });
    });
});
