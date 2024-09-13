import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const PAIR_ADDRESS = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5"; // Ensure this is correct

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const amountADesired = ethers.parseUnits("1", 6); // USDC (6 decimals)
    const amountBDesired = ethers.parseUnits("2", 18); // DAI (18 decimals)
    const amountAMin = ethers.parseUnits("0", 6); // Minimum amount of USDC
    const amountBMin = ethers.parseUnits("0", 18); // Minimum amount of DAI
    const liquidityAmount = ethers.parseUnits("1", 18); // Adjust if necessary

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const DAI_Contract = await ethers.getContractAt("IERC20", DAI, impersonatedSigner);
    const PAIR_Contract = await ethers.getContractAt("IERC20", PAIR_ADDRESS, impersonatedSigner);

    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    // Check initial balances
    const usdcBalBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalBefore = await DAI_Contract.balanceOf(impersonatedSigner.address);
    console.log("USDC balance before adding liquidity", ethers.formatUnits(usdcBalBefore, 6));
    console.log("DAI balance before adding liquidity", ethers.formatUnits(daiBalBefore, 18));

    // Approve the router to spend tokens
    await USDC_Contract.approve(ROUTER_ADDRESS, amountADesired);
    await DAI_Contract.approve(ROUTER_ADDRESS, amountBDesired);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    // Add liquidity
    const addLiquidityTx = await ROUTER.addLiquidity(
        USDC,
        DAI,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        impersonatedSigner.address,
        deadline
    );

    await addLiquidityTx.wait(); // Wait for the transaction to be mined

    console.log("Liquidity added successfully!");

    // Check LP token balance after adding liquidity
    const lpTokenBalAfterAdding = await PAIR_Contract.balanceOf(impersonatedSigner.address);
    console.log("LP Token balance after adding liquidity", ethers.formatUnits(lpTokenBalAfterAdding, 18));

    // Now, remove liquidity
    // Approve the router to spend LP tokens
    await PAIR_Contract.approve(ROUTER_ADDRESS, liquidityAmount);

    const lpTokenBalBeforeRemoving = await PAIR_Contract.balanceOf(impersonatedSigner.address);
    if (lpTokenBalBeforeRemoving < (liquidityAmount)) {
        console.error("Insufficient LP tokens to remove liquidity");
        process.exitCode = 1;
        return;
    }

    // Remove liquidity
    const removeLiquidityTx = await ROUTER.removeLiquidity(
        USDC,
        DAI,
        liquidityAmount,
        amountAMin,
        amountBMin,
        impersonatedSigner.address,
        deadline
    );

    await removeLiquidityTx.wait(); // Wait for the transaction to be mined

    // Check final balances
    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner.address);
    console.log("USDC balance after removing liquidity", ethers.formatUnits(usdcBalAfter, 6));
    console.log("DAI balance after removing liquidity", ethers.formatUnits(daiBalAfter, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
