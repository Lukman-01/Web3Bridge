const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AirdropTokenModule", (m) => {

    const airdropToken = m.contract("AirdropToken");

    return { airdropToken };
});