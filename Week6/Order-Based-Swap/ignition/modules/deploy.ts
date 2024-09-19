import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ContractsModule = buildModule("ContractsModule", (m) => {

  const swap = m.contract("OrderedSwapFactory");

  const gtoken = m.contract("GUZToken");

  const wtoken = m.contract("W3BToken");

  return { swap, gtoken, wtoken};
});

export default ContractsModule;
