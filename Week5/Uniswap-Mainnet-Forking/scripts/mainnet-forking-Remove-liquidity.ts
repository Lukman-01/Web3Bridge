import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const PAIR_ADDRESS = "0xINSERT_LP_TOKEN_ADDRESS"; // Replace with actual LP token address

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const liquidityAmount = ethers.parseUnits("1", 18); // Adjust according to LP token decimals
    const amountAMin = ethers.parseUnits("0", 6); // Minimum amount of USDC
    const amountBMin = ethers.parseUnits("0", 18); // Minimum amount of DAI

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const DAI_Contract = await ethers.getContractAt("IERC20", DAI, impersonatedSigner);
    const PAIR_Contract = await ethers.getContractAt("IERC20", PAIR_ADDRESS, impersonatedSigner);

    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    // Approve the router to spend the LP tokens
    await PAIR_Contract.approve(ROUTER_ADDRESS, liquidityAmount);

    // Check balances before removing liquidity
    const usdcBalBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalBefore = await DAI_Contract.balanceOf(impersonatedSigner.address);
    const lpTokenBalBefore = await PAIR_Contract.balanceOf(impersonatedSigner.address);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before removing liquidity", ethers.formatUnits(usdcBalBefore, 6));
    console.log("dai balance before removing liquidity", ethers.formatUnits(daiBalBefore, 18));
    console.log("lpToken balance before removing liquidity", ethers.formatUnits(lpTokenBalBefore, 18));

    // Remove liquidity
    const tx = await ROUTER.removeLiquidity(
      USDC,
      DAI,
      liquidityAmount,
      amountAMin,
      amountBMin,
      impersonatedSigner.address, // Send tokens to the signer
      deadline
    );

    await tx.wait();  // Wait for the transaction to be mined

    // Check balances after removing liquidity
    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner.address);
    const lpTokenBalAfter = await PAIR_Contract.balanceOf(impersonatedSigner.address);

    console.log("=========================================================");

    console.log("usdc balance after removing liquidity", ethers.formatUnits(usdcBalAfter, 6));
    console.log("dai balance after removing liquidity", ethers.formatUnits(daiBalAfter, 18));
    console.log("lpToken balance after removing liquidity", ethers.formatUnits(lpTokenBalAfter, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
