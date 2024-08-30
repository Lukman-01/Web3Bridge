import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0xe47fCcABcC282fE9A621c88Ad9E8749a38f61C15";

const SaveERC20Module = buildModule("SaveERC20Module", (m) => {

    const save = m.contract("SaveERC20", [tokenAddress]);

    return { save };
});

export default SaveERC20Module;

// Web3CXIModule#Web3CXI - 0xe47fCcABcC282fE9A621c88Ad9E8749a38f61C15
// SaveERC20Module#SaveERC20 - 0xE006Ef36BA678Ed201587E91200de47255c3d664