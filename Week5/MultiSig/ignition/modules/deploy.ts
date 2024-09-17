import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MultisigFactoryModule = buildModule("MultisigFactoryModule", (m) => {

  const multisigFactory = m.contract("MultisigFactory");

  const erc20 = m.contract("Token");

  return { multisigFactory };
});

export default MultisigFactoryModule;



