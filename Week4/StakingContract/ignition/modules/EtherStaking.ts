import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const rewardRate = 2;

const EtherStakingModule = buildModule("EtherStakingModule", (m) => {

    const etherStaking = m.contract("EtherStaking", [rewardRate]);

    return { etherStaking };
});

export default EtherStakingModule;


