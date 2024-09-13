import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const WETH = "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Ensure this is correct

    // Validate and format addresses
    const ROUTER_ADDRESS_CHECKSUM = ethers.getAddress(ROUTER_ADDRESS);
    const USDC_CHECKSUM = ethers.getAddress(USDC);
    const WETH_CHECKSUM = ethers.getAddress(WETH);

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS_CHECKSUM, impersonatedSigner);

    const amountOut = ethers.parseUnits("1", 18); 
    const amountInMax = ethers.parseUnits("100", 6); 

    const path = [USDC_CHECKSUM, WETH_CHECKSUM]; 
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    // Approve USDC to Router
    const USDC_Contract = await ethers.getContractAt("IERC20", USDC_CHECKSUM, impersonatedSigner);
    await USDC_Contract.approve(ROUTER_ADDRESS_CHECKSUM, amountInMax);

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
