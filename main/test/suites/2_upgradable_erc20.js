var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - read balance and totalSupply', function (accounts) {
    it("Read balance and totalSupply Test", function (done) {
        var logInitialize = function () {
            console.log("    [Log]Attempt to initialize proxy");
        }

        var printAccount = function (action, result, expected) {
            var line = "    The balance of account " + action.owner + " is " + result.toString();
            if(expected != null)
                line += ", expected " + expected;
            console.log(line);
        }

        var printTotalSupply = function (action, result, expected) {
            var line = "    The total supply of tested ERC20 " + action.owner + " is " + result.toString();
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
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 1,
                    succeed: true,
                    result: 0,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "balanceOf",
                    owner: 2,
                    succeed: true,
                    result: 0,
                    post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(),
                    action: "totalSupply",
                    succeed: true,
                    result: 10000,
                    post: printTotalSupply,
                    on_error: "Failed to get the token balance"
                },
            ],
        });
    });
});
