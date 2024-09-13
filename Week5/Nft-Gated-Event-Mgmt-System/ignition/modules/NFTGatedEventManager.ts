import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventManageModule = buildModule("EventManageModule", (m) => {
  
  const eventManage = m.contract("NFTGatedEventManager");

  return { eventManage };
});

export default EventManageModule;