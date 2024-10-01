import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployContracts = buildModule("DeployContracts", (m) => {
  
  // Deploy the first contract
  const todoList = m.contract("Todo");

  // Deploy the second contract
  const studentPortal = m.contract("StudentPortal");

  // Return both contracts
  return { todoList, studentPortal };
});

export default DeployContracts;
