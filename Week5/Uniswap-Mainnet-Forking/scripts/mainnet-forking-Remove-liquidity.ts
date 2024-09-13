// import { ethers } from "hardhat";
// const helpers = require("@nomicfoundation/hardhat-network-helpers");

// async function main() {
//     const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
//     const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
//     const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
//     const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

//     await helpers.impersonateAccount(TOKEN_HOLDER);
//     const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

//     const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

//     // Remove liquidity
//     const liquidity = ethers.parseUnits("1", 18);  // Adjust this to your liquidity amount
//     const amountAMin = ethers.parseUnits("0", 6);  // Minimum amount of USDC to receive
//     const amountBMin = ethers.parseUnits("0", 18); // Minimum amount of DAI to receive

//     // Approve router to spend liquidity tokens (LP tokens)
//     const LP_TOKEN = await ethers.getContractAt("IERC20", "LP_TOKEN_ADDRESS", impersonatedSigner);
//     await LP_TOKEN.approve(ROUTER_ADDRESS, liquidity);

//     const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

//     console.log("Removing liquidity...");
//     const removeTx = await ROUTER.removeLiquidity(
//         USDC,
//         DAI,
//         liquidity,
//         amountAMin,
//         amountBMin,
//         impersonatedSigner.address,
//         deadline
//     );

//     await removeTx.wait();
//     console.log("Liquidity removed successfully!");
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });


import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
    
    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    // Manually pass ABI and address to avoid resolveName error
    const IUniswapV2RouterABI = [
        "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)"
    ];

    const ROUTER = new ethers.Contract(ROUTER_ADDRESS, IUniswapV2RouterABI, impersonatedSigner);

    const liquidity = ethers.parseUnits("1", 18);  // Adjust liquidity amount
    const amountAMin = ethers.parseUnits("0", 6);  // Minimum amount of USDC to receive
    const amountBMin = ethers.parseUnits("0", 18); // Minimum amount of DAI to receive

    // Approve router to spend liquidity tokens (LP tokens)
    const LP_TOKEN = await ethers.getContractAt("IERC20", "LP_TOKEN_ADDRESS", impersonatedSigner);
    await LP_TOKEN.approve(ROUTER_ADDRESS, liquidity);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("Removing liquidity...");
    const removeTx = await ROUTER.removeLiquidity(
        USDC,
        DAI,
        liquidity,
        amountAMin,
        amountBMin,
        impersonatedSigner.address,
        deadline
    );

    await removeTx.wait();
    console.log("Liquidity removed successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
