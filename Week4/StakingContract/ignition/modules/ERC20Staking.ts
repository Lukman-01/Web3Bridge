import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0xccA3A3d3a87c02ee547159569b14e18679CE83A7";
const rewardRate = 2;

const ERC20StakingModule = buildModule("ERC20StakingModule", (m) => {

    const eRC20Staking = m.contract("ERC20Staking", [tokenAddress, rewardRate]);

    return { eRC20Staking };
});

export default ERC20StakingModule;