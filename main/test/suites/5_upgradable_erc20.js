var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - transfer balance on be half of the owner', function (accounts) {
    it("Transfer balance on be half of the owner Test", function (done) {
        var logTransferFrom = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                action.from + " to account " + action.to + " through account " + action.account + ", Expected " + action.succeed);
        }

        var printAccount = function (action, result, expected) {
            var line = "    The balance of account " + action.owner + " is " + result.toString();
            if (expected != null)
                line += ", expected " + expected;
            console.log(line);
        }

        var printAllowance = function (action, result, expected) {
            var line = "    The allowance of account " + action.spender + " on behalf of account " + action.owner + " is " + result.toString();
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
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 1,
                    succeed: true,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: 0,
                    spender: 1,
                    amount: 500,
                    succeed: true,
                    on_error: "Failed to approve account 1 to spend on behalf of account 0"
                },
                {
                    block: counter.increment(),
                    action: "allowance",
                    account: 0,
                    owner: 0,
                    spender: 1,
                    succeed: true,
                    post: printAllowance,
                    on_error: "Failed to get the allowance balance"
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: 2,
                    from: 0,
                    to: 1,
                    amount: 200,
                    log: logTransferFrom,
                    succeed: false,
                    on_error: "Transfer balance through account 2 on behalf of account 0 is not allowed"
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: 1,
                    from: 0,
                    to: 1,
                    amount: 200,
                    succeed: true,
                    on_error: "Failed to transfer balance through account 1 on behalf of account 0"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 0,
                    succeed: true,
                    result: 9800,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 1,
                    succeed: true,
                    result: 200,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "allowance",
                    account: 0,
                    owner: 0,
                    spender: 1,
                    succeed: true,
                    result: 300,
                    post: printAllowance,
                    on_error: "Failed to get the allowance balance"
                },
            ],
        });
    });
});
