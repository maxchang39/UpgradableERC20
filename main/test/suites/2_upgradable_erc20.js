var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - read balance and totalSupply', function (accounts) {
    it("Read balance and totalSupply Test", function (done) {
        var logInitialize = function (action) {
            console.log("    [Log]Attempt to initialize proxy, Expected " + action.succeed);
        }

        var printAccount = function (action, result, expected) {
            var line = "    The balance of account " + accounts.indexOf(action.owner) + " is " + result.toString();
            if(expected != null)
                line += ", expected " + expected;
            console.log(line);
        }

        var printTotalSupply = function (action, result, expected) {
            var line = "    The total supply of tested ERC20 " + accounts.indexOf(action.owner) + " is " + result.toString();
            if(expected != null)
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
                    result: 10000,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: accounts[1],
                    account: accounts[0],
                    succeed: true,
                    result: 0,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: accounts[2],
                    account: accounts[0],
                    succeed: true,
                    result: 0,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "totalSupply",
                    account: accounts[0],
                    succeed: true,
                    result: 10000,
                    post: printTotalSupply,
                    on_error: "Failed to get the token balance"
                },
            ],
        });
    });
});
