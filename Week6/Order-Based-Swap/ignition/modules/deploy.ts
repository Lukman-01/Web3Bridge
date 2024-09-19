import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ContractsModule = buildModule("LockModule", (m) => {

  const swap = m.contract("OrderedSwap");

  const token = m.contract("Token");

  return { swap, token };
});

export default ContractsModule;
