import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AreaOfShapes = buildModule("AreaOfShapes", (m) => {
   

  const area = m.contract("AreaOfShapes");

  return { area};
});

export default AreaOfShapes;