import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0xe47fCcABcC282fE9A621c88Ad9E8749a38f61C15";
const rewardRate = 2;

const ERC20StakingModule = buildModule("ERC20StakingModule", (m) => {

    const eRC20Staking = m.contract("ERC20Staking", [tokenAddress, rewardRate]);

    return { eRC20Staking };
});

export default ERC20StakingModule;