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

                        function error(message) {
                            done(Error("Test: " + message));
                        }

                        function fail(action, message) {
                            done(Error("Action " + action + ": " + message));
                        }

                        // Internal run actions function.
                        function run_() {
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
                                if (action.succeed) {
                                    return fail(actionNumber, action.on_error + ": " + error.toString().replace(/^error: /i, ""));
                                }

                                if (action.post) {
                                    action.post(action);
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
    // suppose no signature change, use the i1 signature
    var implementation = UpgradableERC20.at(instance.address);

    if(action.version != null){
        if(action.implementation == null) {
            var impl = implementations[action.version - 1].address;
        } else {
            var impl = action.implementation;
        }
    }

    switch (action.action) {
        case "upgradeTo":
            return instance.upgradeTo(
                impl,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "initialize":
            return implementation.initialize(
                action.totalSupply,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "totalSupply":
            return implementation.totalSupply(
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "balanceOf":
            return implementation.balanceOf(
                action.owner,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transfer":
            return implementation.transfer(
                action.to,
                action.amount,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transferFrom":
            return implementation.transferFrom(
                action.from,
                action.to,
                action.amount,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "transferOwner":
            return implementation.transferOwner(
                action.to,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "allowance" :
            return implementation.allowance(
                action.owner,
                action.spender,
                action.amount,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "approve" :
            return implementation.approve(
                action.spender,
                action.amount,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "owner" :
            return implementation.owner(
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "freeze" :
            return implementation.freeze(
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "unfreeze" :
            return implementation.unfreeze(
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        case "blacklist":
            return implementation.blacklist(
                action.user,
                {
                    from: action.account,
                    to: instance.address,
                    gasPrice: gasPrice,
                    gas: gasAllocated
                });
            break;
        default:
            return null;
    }
}