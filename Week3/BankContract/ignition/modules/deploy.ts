import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BankAccount = buildModule("BankAccount", (m) => {
   

  const bankAccount = m.contract("BankAccount");

  return { bankAccount};
});

export default BankAccount;