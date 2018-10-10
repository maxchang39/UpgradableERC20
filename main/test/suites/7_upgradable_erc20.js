var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - freeze contract', function (accounts) {
    it("Freeze contract Test", function (done) {
        var logTransfer = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                action.account + " to account " + action.to + ", Expected " + action.succeed);
        }

        var logFreeze = function (action) {
            console.log("    [Log]Attempt to freeze the contract, Expected " + action.succeed);
        }

        var logUnfreeze = function (action) {
            console.log("    [Log]Attempt to unfreeze the contract, Expected " + action.succeed);
        }

        var printAccount = function (action, result, expected) {
            var line = "    The balance of account " + action.owner + " is " + result.toString();
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
                    action: "balanceOf",
                    owner: 0,
                    succeed: true,
                    result: 10000,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 1,
                    succeed: true,
                    result: 0,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
                {
                    block: counter.increment(),
                    action: "freeze",
                    account: 0,
                    log: logFreeze,
                    succeed: true,
                    on_error: "Failed to freeze the contract",
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: 0,
                    to: 1,
                    amount: 450,
                    log: logTransfer,
                    succeed: false,
                    on_error: "Transfer should fail when the contract is freeze."
                },
                {
                    block: counter.increment(),
                    action: "unfreeze",
                    account: 0,
                    log: logUnfreeze,
                    succeed: true,
                    on_error: "Failed to unfreeze the contract",
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: 0,
                    to: 1,
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "Failed to transfer balance after unfreeze."
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 0,
                    succeed: true,
                    result: 9550,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 1,
                    succeed: true,
                    result: 450,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
            ]
        });
    });
});
