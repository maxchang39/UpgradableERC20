var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - approve accounts to transfer balance on be half of the owner', function (accounts) {
    it("Approve accounts to transfer balance on be half of the owner Test", function (done) {
        var logInitialize = function () {
            console.log("    [Log]Attempt to initialize proxy");
        }

        var printAllowance = function (action, result, expected) {
            var line = "    The allowance of account " + action.spender + " on behalf of account " + action.owner +" is " + result.toString();
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
                    action: "allowance",
                    account: 0,
                    owner: 0,
                    spender: 1,
                    succeed: true,
                    result: 0,
                    post: printAllowance,
                    on_error: "Failed to get the allowance balance"
                },
                {
                    block: counter.increment(),
                    action: "approve",
                    account: 0,
                    spender: 1,
                    amount: 200,
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
                    result: 200,
                    post: printAllowance,
                    on_error: "Failed to get the allowance balance"
                },
            ],
        });
    });
});
