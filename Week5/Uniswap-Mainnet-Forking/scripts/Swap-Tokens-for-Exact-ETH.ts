import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    const amountOut = ethers.parseUnits("1", 18); // Amount of ETH to receive
    const amountInMax = ethers.parseUnits("100", 6); // Max amount of USDC willing to spend

    const path = [USDC, "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2"];  // USDC -> WETH path
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    // Approve USDC to Router
    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    await USDC_Contract.approve(ROUTER_ADDRESS, amountInMax);

    console.log("Swapping USDC for ETH...");
    const swapTx = await ROUTER.swapTokensForExactETH(
        amountOut,
        amountInMax,
        path,
        impersonatedSigner.address,
        deadline
    );

    await swapTx.wait();
    console.log("Swap completed: USDC to ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
