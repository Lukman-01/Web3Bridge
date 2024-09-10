import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MultiSigModule = buildModule("MultiSigModule", (m) => {

  const multiSig = m.contract("MultiSig");

  return { multiSig };
});

export default MultiSigModule;
