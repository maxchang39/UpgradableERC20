var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - ownership read and transfer', function (accounts) {
    it("Ownership read and transfer Test", function (done) {
        var logTransferOwner = function (action) {
            console.log("    [Log]Attempt to transfer ownership from account " +
                action.account + " to account " + action.to + " through account " + action.account + ", Expected " + action.succeed);
        }

        var printOwner = function (action, result) {
            console.log("    The owner of ERC20 is account " + accounts.indexOf(result));
        }

        counter.reset();

        run(accounts, done, {
            type: "erc",
            actions: [
                {
                    block: counter.increment(),
                    action: "owner",
                    succeed: true,
                    post: printOwner,
                    result: accounts[0],
                    on_error: "Failed to get the owner of the account"
                },
                {
                    block: counter.increment(),
                    action: "transferOwner",
                    account: 1,
                    to: 1,
                    log: logTransferOwner,
                    succeed: false,
                    result: accounts[0],
                    on_error: "No account should be able to transfer ownership on behalf of owner"
                },
                {
                    block: counter.increment(),
                    action: "owner",
                    succeed: true,
                    post: printOwner,
                    result: accounts[0],
                    on_error: "Failed to get the owner of the account"
                },
                {
                    block: counter.increment(),
                    action: "transferOwner",
                    account: 0,
                    to: 1,
                    log: logTransferOwner,
                    succeed: true,
                    on_error: "Failed to transfer the ownership to a different account"
                },
                {
                    block: counter.increment(),
                    action: "owner",
                    succeed: true,
                    post: printOwner,
                    result: accounts[1],
                    on_error: "Failed to get the owner of the account"
                },
            ]
        });
    });
});
