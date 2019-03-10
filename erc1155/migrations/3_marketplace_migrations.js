var Token = artifacts.require('./GameToken.sol');
var Marketplace = artifacts.require('./Marketplace.sol');

module.exports = (deployer) => deployer
.then(() => deployMarketplace(deployer));

function deployMarketplace(deployer) {
    return deployer.deploy(Marketplace, Token.address);
}