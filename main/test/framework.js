// Test Starts here

var BigNumber = require('bignumber.js');
var UpgradableERC20 = artifacts.require("./TestToken.sol");

// Run a test with the given accounts, done callback, and auction schema.
module.exports = function (accounts, done, schema) {
    var gasPrice = new BigNumber(15000000000);
    if (schema.gasPrice) {
        gasPrice = schema.gasPrice;
    }

    var gasAllocated = new BigNumber(21000).times(5);
    if (schema.gasAllocated) {
        gasAllocated = schema.gasAllocated;
    }

    var C;
    // Start the contract.
    switch (schema.type) {
        case "erc":
            C = UpgradableERC20;
            C.new({from: accounts[0]}).then(function (instance) {
                var nopaccount = accounts[accounts.length - 1];

                //console.log(schema.action);
                var actions = schema.actions;
                var nonces = [];

                function error(message) {
                    done(Error("Test: " + message));
                }

                function fail(action, message) {
                    done(Error("Action " + action + ": " + message));
                }

                function print(accounts, c) {
                    for (i = 0; i < c; i++) {
                        //console.log("accounts[" + i + "]: " + accounts[i] + " " + web3.eth.getBalance(accounts[i]));
                    }
                }

                // Internal run actions function.
                function run_(block, index) {
                    //console.log("web3.eth.blockNumber: " + web3.eth.blockNumber + " block=" + block + " index=" + index);
                    // If we've run out of actions, the test has passed.
                    if (index >= actions.length) {
                        done();
                        return;
                    }
                    var action = actions[index];
                    var nextBlock = block + 1;
                    var nextIndex = index + 1;
                    // If the next action takes place in a future block, delay.
                    if (action.block > block) {
                        instance.nop({from: nopaccount}).then(function (result) {
                            run_(nextBlock, index);
                        });
                        return;
                    }
                    // If the next action takes place in a previous block, error.
                    if (action.block != block) {
                        return error("Current block is " + block + ", but action " + index +
                            " takes place in prior block " + action.block);
                    }

                    //console.log("Running action: " + action.action);
                    // Run the action and get a promise.
                    var promise;

                    promise = performAction(action, instance, accounts, gasPrice, gasAllocated);

                    if (!promise)
                        return error("Unknown action " + action.action);

                    if(action.log != null)
                        action.log(action);

                    // Continue the computation after the promise.
                    promise.then(function (result) {
                        if (!action.succeed) {
                            return fail(index, action.on_error);
                        }

                        if (action.post) {
                            action.post(action, result, action.result);
                        }



                        if (action.result != null) {
                            if (action.result != result) {
                                return error("Wrong return on " + action.action + ". Expected " + action.result + ", Get " + result);
                            }
                        }

                        run_(nextBlock, nextIndex);
                    }).catch(function (error) {
                        print(accounts, 3);
                        if (action.succeed) {
                            return fail(index, action.on_error + ": " + error.toString().replace(/^error: /i, ""));
                        }

                        if (action.post) {
                            action.post(error);
                        }

                        run_(nextBlock, nextIndex);
                    });
                }

                //console.log("Create contract " + schema.type + " at block number: " + web3.eth.blockNumber);
                // Start the contract.
                run_(1, 0);
            });
            break;
        default:
            return error("Unknown contract type " + schema.type);
    }
}

function performAction(action, instance, accounts, gasPrice, gasAllocated) {
    var account = accounts[action.account];

    switch (action.action) {
        case "totalSupply":
            return instance.totalSupply(
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "balanceOf":
            return instance.balanceOf(
                accounts[action.owner],
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transfer":
            return instance.transfer(
                accounts[action.to],
                action.amount,
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transferFrom":
            return instance.transferFrom(
                accounts[action.from],
                accounts[action.to],
                action.amount,
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transferOwner":
            return instance.transferOwner(
                accounts[action.to],
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "allowance":
            return instance.allowance(
                accounts[action.owner],
                accounts[action.spender],
                action.amount,
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "approve":
            return instance.approve(
                accounts[action.spender],
                accounts[action.amount],
                action.amount,
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "owner":
            return instance.owner(
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "freeze":
            return instance.freeze(
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "unfreeze":
            return instance.unfreeze(
                {
                    from: account,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        default:
            return null;
    }
}