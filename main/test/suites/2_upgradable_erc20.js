var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20', function (accounts) {
    it("test balanceOf and ", function (done) {
        var printAccount = function (action, result) {
            console.log("    The balance of account " + action.owner + " is " + result.toString());
        }

        var printTotalSupply = function (action, result) {
            console.log("    The total supply of the ERC20 is " + result.toString());
        }

        counter.reset();

        run(accounts, done, {
            type: "erc",
            actions: [
                {
                    block: counter.increment(), action: "balanceOf", owner: 0, succeed: true, post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(), action: "balanceOf", owner: 1, succeed: true, post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(), action: "balanceOf", owner: 2, succeed: true, post: printAccount,
                    on_error: "Failed to get the token balance"
                },
                {
                    block: counter.increment(), action: "totalSupply", succeed: true, post: printTotalSupply,
                    on_error: "Failed to get the token balance"
                },
            ],
        });
    });
});
