var BigNumber = require('bignumber.js');
var run = require('../framework.js');

contract('Upgradable ERC20 - Contract Construction', function (accounts) {

    it("Contract Construction Test", function (done) {
        run(accounts, done, {
            type: "erc",
            actions: [],
        });
    });
});
