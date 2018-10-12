var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - upgrade proxy test', function (accounts) {
    it("Upgrade proxy Test", function (done) {
        var logInitialize = function () {
            console.log("    [Log]Attempt to initialize proxy");
        }

        var logTransfer = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                action.account + " to account " + action.to + ", Expected " + action.succeed);
        }

        var logUpgradeTo = function (action) {
            console.log("    [Log]Attempt to upgrade implementation to version " + action.version + ", Expected " + action.succeed);
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
                    action: "initialize",
                    account: 0,
                    succeed: true,
                    post: logInitialize,
                    on_error: "Failed to initialize proxy"
                },
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
                    action: "transfer",
                    account: 0,
                    to: 1,
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "Failed to transfer balance to account 1"
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
                    action: "upgradeTo",
                    version: 2,
                    succeed: true,
                    account: 0,
                    post: logUpgradeTo,
                    on_error: "Failed to assign the implementation"
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: 0,
                    to: 1,
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "Failed to transfer balance to account 1"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 0,
                    succeed: true,
                    result: 9549,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 1,
                    succeed: true,
                    result: 451,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
            ],
        });
    });
});
