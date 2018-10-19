var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - transfer balance on be half of the owner', function (accounts) {
    it("Transfer balance on be half of the owner Test", function (done) {
        var logInitialize = function (action) {
            console.log("    [Log]Attempt to initialize proxy, Expected " + action.succeed);
        }

        var logTransferFrom = function (action) {
            console.log("    [Log]Attempt to transfer " + accounts.indexOf(action.amount) + " from account " +
                accounts.indexOf(action.from) + " to account " + accounts.indexOf(action.to) + " through account " +
                accounts.indexOf(action.account) + ", Expected " + action.succeed);
        }

        var printAccount = function (action, result, expected) {
            var line = "    The balance of account " + accounts.indexOf(action.owner) + " is " + result.toString();
            if (expected != null)
                line += ", expected " + expected;
            console.log(line);
        }

        var printAllowance = function (action, result, expected) {
            var line = "    The allowance of account " + accounts.indexOf(action.spender) +
                " on behalf of account " + accounts.indexOf(action.owner) + " is " + result.toString();
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
                    owner: accounts[0],
                    account: accounts[0],
                    succeed: true,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: accounts[1],
                    account: accounts[0],
                    succeed: true,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: accounts[0],
                    spender: accounts[1],
                    amount: 500,
                    succeed: true,
                    on_error: "Failed to approve account 1 to spend on behalf of account 0"
                },
                {
                    block: counter.increment(),
                    action: "allowance",
                    account: accounts[0],
                    owner: accounts[0],
                    spender: accounts[1],
                    succeed: true,
                    post: printAllowance,
                    on_error: "Failed to get the allowance balance"
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: accounts[2],
                    from: accounts[0],
                    to: accounts[1],
                    amount: 200,
                    log: logTransferFrom,
                    succeed: false,
                    on_error: "Transfer balance through account 2 on behalf of account 0 is not allowed"
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: accounts[1],
                    from: accounts[0],
                    to: accounts[1],
                    amount: 20000,
                    log: logTransferFrom,
                    succeed: false,
                    on_error: "Transfer from account 0 to account 1 through account 1 should fail because of low balance"
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: accounts[1],
                    from: accounts[0],
                    to: accounts[1],
                    amount: 200,
                    log: logTransferFrom,
                    succeed: true,
                    on_error: "Failed to transfer balance through account 1 on behalf of account 0"
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: accounts[1],
                    from: accounts[0],
                    to: 0,
                    amount: 200,
                    log: logTransferFrom,
                    succeed: false,
                    on_error: "Transfer balance to address 0x0 should fail"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[0],
                    succeed: true,
                    result: 9800,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[1],
                    succeed: true,
                    result: 200,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "allowance",
                    account: accounts[0],
                    owner: accounts[0],
                    spender: accounts[1],
                    succeed: true,
                    result: 300,
                    post: printAllowance,
                    on_error: "Failed to get the allowance balance"
                },
            ],
        });
    });
});
