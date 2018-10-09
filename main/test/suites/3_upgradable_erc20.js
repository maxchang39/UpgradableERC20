var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20', function (accounts) {
    it("test transfer balance", function (done) {
        var printAccount = function (action, result) {
            console.log("    The balance of account " + action.owner + " is " + result.toString());
        }

        counter.reset();

        run(accounts, done, {
            type: "erc",
            actions: [
                {
                    block: counter.increment(), action: "balanceOf", owner: 0, succeed: true,　 post: printAccount,
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
                    block: counter.increment(),
                    action: "transfer",
                    account: 1,
                    to: 2,
                    amount: 450,
                    succeed: false,
                    on_error: "transfer balance from account 1 to 2 should fail because of low balance"
                },
                {
                    block: counter.increment(),
                    action: "transfer",
                    account: 0,
                    to: 1,
                    amount: 450,
                    succeed: true,
                    on_error: "transfer balance from account 0 to 1 should succeed"
                },
                {
                    block: counter.increment(), action: "balanceOf", owner: 0, succeed: true, post: printAccount,
                    on_error: "Failed to get the token balance",
                    on_incorrect_result: "Incorrect balance on account " + this.account + " after transfer "
                },
                {
                    block: counter.increment(), action: "balanceOf", owner: 1, succeed: true, post: printAccount,
                    on_error: "Failed to get the token balance",
                    on_incorrect_result: "Incorrect balance on account " + this.account + " after transfer "
                },
                {
                    block: counter.increment(), action: "balanceOf", owner: 2, succeed: true, post: printAccount,
                    on_error: "Failed to get the token balance",
                    on_incorrect_result: "Incorrect balance on account " + this.account + " after transfer "
                },

            ],
        });
    });
}