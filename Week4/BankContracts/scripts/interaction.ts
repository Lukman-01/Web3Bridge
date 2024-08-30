import { ethers } from "hardhat";

async function main() {
    const web3CXITokenAddress = "0xe47fCcABcC282fE9A621c88Ad9E8749a38f61C15";
    const web3CXI = await ethers.getContractAt("IERC20", web3CXITokenAddress);

    const saveERC20ContractAddress = "0xE006Ef36BA678Ed201587E91200de47255c3d664";
    const saveERC20 = await ethers.getContractAt("ISaveERC20", saveERC20ContractAddress);

    // Approve savings contract to spend token
    const approvalAmount = ethers.parseUnits("1000", 18);

    const approveTx = await web3CXI.approve(saveERC20, approvalAmount);
    approveTx.wait();

    const contractBalanceBeforeDeposit = await saveERC20.getContractBalance();
    console.log("Contract balance before :::", contractBalanceBeforeDeposit);

    const depositAmount = ethers.parseUnits("150", 18);
    const depositTx = await saveERC20.deposit(depositAmount);

    console.log(depositTx);

    depositTx.wait();

    const contractBalanceAfterDeposit = await saveERC20.getContractBalance();

    console.log("Contract balance after :::", contractBalanceAfterDeposit);

    // Withdrawal Interaction
    const widrawAmount = ethers.parseUnits("50", 18);
    const withdrawalTx = await saveERC20.withdraw(widrawAmount);
    console.log(withdrawalTx);
    withdrawalTx.wait();

    const contractBalanceAfterWithdrawal = await saveERC20.getContractBalance();

    console.log("Contract balance after withdrawal:::", contractBalanceAfterWithdrawal);

    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
