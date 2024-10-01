import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenModule = buildModule("TokenModule", (m) => {

    const erc20 = m.contract("Token");

    return { erc20 };
});

export default TokenModule;