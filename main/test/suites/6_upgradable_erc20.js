var BigNumber = require('bignumber.js');
var run = require('../framework.js');
var counter = require('../blockCounter.js');

contract('Upgradable ERC20 - ownership read and transfer', function (accounts) {
    it("Ownership read and transfer Test", function (done) {
        var logInitialize = function (action) {
            console.log("    [Log]Attempt to initialize proxy, Expected " + action.succeed);
        }

        var logTransferOwner = function (action) {
            console.log("    [Log]Attempt to transfer ownership from account " +
                accounts.indexOf(action.account) + " to account " + accounts.indexOf(action.to) + ", Expected " + action.succeed);
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
                    action: "initialize",
                    account: accounts[0],
                    succeed: true,
                    post: logInitialize,
                    on_error: "Failed to initialize proxy"
                },
                {
                    block: counter.increment(),
                    action: "owner",
                    account: accounts[0],
                    succeed: true,
                    post: printOwner,
                    result: accounts[0],
                    on_error: "Failed to get the owner of the account"
                },
                {
                    block: counter.increment(),
                    action: "transferOwner",
                    account: accounts[1],
                    to: accounts[1],
                    log: logTransferOwner,
                    succeed: false,
                    result: accounts[0],
                    on_error: "No account should be able to transfer ownership on behalf of owner"
                },
                {
                    block: counter.increment(),
                    action: "owner",
                    account: accounts[0],
                    succeed: true,
                    post: printOwner,
                    result: accounts[0],
                    on_error: "Failed to get the owner of the account"
                },
                {
                    block: counter.increment(),
                    action: "transferOwner",
                    account: accounts[0],
                    to: accounts[1],
                    log: logTransferOwner,
                    succeed: true,
                    on_error: "Failed to transfer the ownership to a different account"
                },
                {
                    block: counter.increment(),
                    action: "owner",
                    account: accounts[0],
                    succeed: true,
                    post: printOwner,
                    result: accounts[1],
                    on_error: "Failed to get the owner of the account"
                },
            ]
        });
    });
});
