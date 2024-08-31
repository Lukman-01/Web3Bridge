import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ERC20TokenModule = buildModule("ERC20TokenModule", (m) => {

    const eRC20Token = m.contract("ERC20Token");

    return { eRC20Token };
});

export default ERC20TokenModule;