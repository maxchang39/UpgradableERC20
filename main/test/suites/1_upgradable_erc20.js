var BigNumber = require('bignumber.js');
var run = require('../framework.js');

contract('Upgradable ERC20', function (accounts) {

    it("creates a upgradable erc20 contract", function (done) {
        run(accounts, done, {
            type: "erc",
            actions: [],
        });
    });
});
