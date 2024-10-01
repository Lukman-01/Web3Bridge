import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0x4836F1CeE8561f8137f4AFd4b3C6594e4aCFD663";

const SaveERC20Module = buildModule("SaveERC20Module", (m) => {

    const save = m.contract("SaveERC20", [tokenAddress]);

    return { save };
});

export default SaveERC20Module;