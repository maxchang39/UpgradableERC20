var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - blacklist users', function (accounts) {
    it("Blacklist users Test", function (done) {
        var logTransfer = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                action.account + " to account " + action.to + ", Expected " + action.succeed);
        }

        var logApprove = function (action) {
            console.log("    [Log]Attempt to approve " + action.spender + " to spend " +
                action.amount + " on behalf of account " + action.account + ", Expected " + action.succeed);
        }

        var logBlacklist = function (action) {
            console.log("    [Log]Attempt to blacklist the account" + action.user +", Expected " + action.succeed);
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
                    action: "blacklist",
                    account: 0,
                    user: 2,
                    log: logBlacklist,
                    succeed: true,
                    on_error: "Failed to blacklist account 2",
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: 0,
                    to: 1,
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "Failed to transfer the balance to account 1."
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: 0,
                    to: 2,
                    amount: 450,
                    log: logTransfer,
                    succeed: false,
                    on_error: "The transfer should fail because user 2 has been blacklisted."
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: 1,
                    spender: 2,
                    amount: 450,
                    log: logApprove,
                    succeed: false,
                    on_error: "The approve should fail because account 2 has been blacklisted."
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
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 2,
                    succeed: true,
                    result: 0,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
            ]
        });
    });
});
