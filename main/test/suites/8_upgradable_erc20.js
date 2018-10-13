var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - blacklist users', function (accounts) {
    it("Blacklist users Test", function (done) {
        var logInitialize = function (action) {
            console.log("    [Log]Attempt to initialize proxy, Expected " + action.succeed);
        }

        var logTransfer = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                accounts.indexOf(action.account) + " to account " + accounts.indexOf(action.to) +
                ", Expected " + action.succeed);
        }

        var logTransferFrom = function (action) {
            console.log("    [Log]Attempt to transfer " + action.amount + " from account " +
                accounts.indexOf(action.from) + " to account " + accounts.indexOf(action.to) + " through account " +
                accounts.indexOf(action.account) + ", Expected " + action.succeed);
        }


        var logTransferOwner = function (action) {
            console.log("    [Log]Attempt to transfer ownership from account " +
                accounts.indexOf(action.account) + " to account " + accounts.indexOf(action.to) + ", Expected " + action.succeed);
        }

        var logApprove = function (action) {
            console.log("    [Log]Attempt to approve " + accounts.indexOf(action.spender) + " to spend " +
                action.amount + " on behalf of account " + accounts.indexOf(action.account) + ", Expected " + action.succeed);
        }

        var logBlacklist = function (action) {
            console.log("    [Log]Attempt to blacklist the account" + accounts.indexOf(action.user) +", Expected " + action.succeed);
        }

        var printAccount = function (action, result, expected) {
            var line = "    The balance of account " + accounts.indexOf(action.owner) + " is " + result.toString();
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
                    action: "approve",
                    account: accounts[2],
                    spender: accounts[0],
                    amount: 450,
                    log: logApprove,
                    succeed: true,
                    on_error: "Failed to approve account."
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: accounts[0],
                    spender: accounts[2],
                    amount: 450,
                    log: logApprove,
                    succeed: true,
                    on_error: "Failed to approve account."
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: accounts[0],
                    spender: accounts[1],
                    amount: 450,
                    log: logApprove,
                    succeed: true,
                    on_error: "Failed to approve account."
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: accounts[0],
                    to: accounts[2],
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "Failed to transfer the balance to account 2."
                },
                {
                    block: counter.increment(),
                    action: "blacklist",
                    account: accounts[1],
                    user: accounts[2],
                    log: logBlacklist,
                    succeed: false,
                    on_error: "No account should be able to blacklist other than owner",
                },
                {
                    block: counter.increment(),
                    action: "blacklist",
                    account: accounts[0],
                    user: accounts[2],
                    log: logBlacklist,
                    succeed: true,
                    on_error: "Failed to blacklist account 2",
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: accounts[0],
                    to: accounts[1],
                    amount: 450,
                    log: logTransfer,
                    succeed: true,
                    on_error: "Failed to transfer the balance to account 1."
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: accounts[0],
                    to: accounts[2],
                    amount: 450,
                    log: logTransfer,
                    succeed: false,
                    on_error: "The transfer should fail because user 2 has been blacklisted."
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: accounts[2],
                    to: accounts[0],
                    amount: 200,
                    log: logTransfer,
                    succeed: false,
                    on_error: "The transfer should fail because user 2 has been blacklisted."
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: accounts[1],
                    spender: accounts[2],
                    amount: 450,
                    log: logApprove,
                    succeed: false,
                    on_error: "The approve should fail because account 2 has been blacklisted."
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: accounts[2],
                    spender: accounts[1],
                    amount: 450,
                    log: logApprove,
                    succeed: false,
                    on_error: "The approve should fail because account 2 has been blacklisted."
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
                    account: accounts[0],
                    from: accounts[2],
                    to: accounts[1],
                    amount: 200,
                    log: logTransferFrom,
                    succeed: false,
                    on_error: "Transfer balance through account 2 on behalf of account 0 is not allowed"
                },
                {
                    block: counter.increment(),
                    action: "transferFrom",
                    account: accounts[0],
                    from: accounts[1],
                    to: accounts[2],
                    amount: 200,
                    log: logTransferFrom,
                    succeed: false,
                    on_error: "Transfer balance through account 2 on behalf of account 0 is not allowed"
                },
                {
                    block: counter.increment(),
                    action: "transferOwner",
                    account: accounts[0],
                    to: accounts[2],
                    log: logTransferOwner,
                    succeed: false,
                    on_error: "Transfer ownership should fail since account 2 has been blacklisted"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[0],
                    succeed: true,
                    result: 9100,
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
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    account: accounts[0],
                    owner: accounts[2],
                    succeed: true,
                    result: 450,
                    post: printAccount,
                    on_error: "Failed to get the token balance",
                },
            ]
        });
    });
});
