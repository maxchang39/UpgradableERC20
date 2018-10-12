// Test Starts here

var BigNumber = require('bignumber.js');
var UpgradableERC20 = artifacts.require("./TestToken.sol");
var UpgradableERC20V2 = artifacts.require("./TestTokenV2.sol");
var UpgradableERC20Proxy = artifacts.require("./TestTokenProxy.sol");
var version = 1;

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

    // Start the contract.
    switch (schema.type) {
        case "erc":
            var blockNumber = 0;
            var actionNumber = 0;
            var implementations = [];

            UpgradableERC20.new({from: accounts[0]}).then(function (i1) {
                implementations.push(i1);
                UpgradableERC20V2.new({from: accounts[0]}).then(function (i2) {
                    implementations.push(i2);
                    UpgradableERC20Proxy.new(i1.address, {from: accounts[0]}).then(function (instance) {
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
                        function run_() {
                            //console.log("web3.eth.blockNumber: " + web3.eth.blockNumber + " block=" + block + " index=" + index);
                            // If we've run out of actions, the test has passed.
                            if (actionNumber >= actions.length) {
                                done();
                                return;
                            }
                            var action = actions[actionNumber];

                            blockNumber = blockNumber + 1;
                            actionNumber = actionNumber + 1;

                            // If the next action takes place in a future block, delay.
                            if (action.block > blockNumber) {
                                instance.nop({from: nopaccount}).then(function (result) {
                                    run_();
                                });
                                return;
                            }
                            // If the next action takes place in a previous block, error.
                            if (action.block != blockNumber) {
                                return error("Current block is " + blockNumber + ", but action " + actionNumber +
                                    " takes place in prior block " + action.block);
                            }

                            //console.log("Running action: " + action.action);
                            // Run the action and get a promise.
                            var promise;

                            promise = performAction(action, instance, accounts, gasPrice, gasAllocated, implementations);

                            if (!promise)
                                return error("Unknown action " + action.action);

                            if (action.log != null)
                                action.log(action);

                            if(action.version != null)
                                version = action.version;

                            // Continue the computation after the promise.
                            promise.then(function (result) {
                                if (!action.succeed) {
                                    return fail(actionNumber, action.on_error);
                                }

                                if (action.post) {
                                    action.post(action, result, action.result);
                                }


                                if (action.result != null) {
                                    if (action.result != result) {
                                        return error("Wrong return on " + action.action + ". Expected " + action.result + ", Get " + result);
                                    }
                                }

                                run_();
                            }).catch(function (error) {
                                print(accounts, 3);
                                if (action.succeed) {
                                    return fail(actionNumber, action.on_error + ": " + error.toString().replace(/^error: /i, ""));
                                }

                                if (action.post) {
                                    action.post(error);
                                }

                                run_();
                            });
                        }

                        //console.log("Create contract " + schema.type + " at block number: " + web3.eth.blockNumber);
                        // Start the contract.
                        run_();
                    });
                });
            });
            break;
        default:
            return error("Unknown contract type " + schema.type);
    }
}

function performAction(action, instance, accounts, gasPrice, gasAllocated, implementations) {
    var account = accounts[action.account];

    // suppose no signature change, use the i1 signature
    var implementation = UpgradableERC20.at(instance.address);

    switch (action.action) {
        case "upgradeTo":
            return instance.upgradeTo(
                implementations[action.version-1].address,
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "initialize":
            return implementation.initialize(
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "totalSupply":
            return implementation.totalSupply(
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "balanceOf":
            return implementation.balanceOf(
                accounts[action.owner],
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transfer":
            return implementation.transfer(
                accounts[action.to],
                action.amount,
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transferFrom":
            return implementation.transferFrom(
                accounts[action.from],
                accounts[action.to],
                action.amount,
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transferOwner":
            return implementation.transferOwner(
                accounts[action.to],
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "allowance" :
            return implementation.allowance(
                accounts[action.owner],
                accounts[action.spender],
                action.amount,
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "approve" :
            return implementation.approve(
                accounts[action.spender],
                accounts[action.amount],
                action.amount,
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "owner" :
            return implementation.owner(
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "freeze" :
            return implementation.freeze(
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "unfreeze" :
            return implementation.unfreeze(
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "blacklist":
            return implementation.blacklist(
                accounts[action.user],
                {
                    from: account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        default:
            return null;
    }
}