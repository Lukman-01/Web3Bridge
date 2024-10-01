import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MultisigFactoryModule = buildModule("MultisigFactoryModule", (m) => {

  // const quorum = 3;
  // const validSigners = [
  //   "0x40feacdeee6f017fA2Bc1a8FB38b393Cf9022d71", 
  //   "0x186a761645f2A264ad0A655Fb632Ca99150803A9", 
  //   "0xB281ceA3F59B5045246fcA2ad2598f414A3BEb43"
  // ];

  const multisigFactory = m.contract("MultisigFactory");


  return { multisigFactory};
});

export default MultisigFactoryModule;



