var Token = artifacts.require('./GameToken.sol');

module.exports = (deployer) => deployer
.then(() => deployToken(deployer));

function deployToken(deployer) {
    return deployer.deploy(Token);
}