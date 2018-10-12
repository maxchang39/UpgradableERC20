var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - transfer balance', function (accounts) {
    it("Transfer balance Test", function (done) {
        var logInitialize = function () {
            console.log("    [Log]Attempt to initialize proxy");
        }

        var logTransfer = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                action.account + " to account " + action.to + ", Expected " + action.succeed);
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
                    account: 1,
                    to: 2,
                    amount: 450,
                    log: logTransfer,
                    succeed: false,
                    on_error: "transfer balance from account 1 to 2 should fail because of low balance"
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: 0,
                    to: 1,
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "transfer balance from account 0 to 1 should succeed"
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

            ],
        });
    });
});
