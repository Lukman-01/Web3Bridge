import { ethers } from "hardhat";

async function main() {
    // Define the address of the deployed Web3CXI ERC20 token contract
    const web3CXITokenAddress = "0xe47fCcABcC282fE9A621c88Ad9E8749a38f61C15";
    // Get an instance of the Web3CXI contract using its ABI (IERC20) and address
    const web3CXI = await ethers.getContractAt("IERC20", web3CXITokenAddress);

    // Define the address of the deployed SaveERC20 contract
    const saveERC20ContractAddress = "0xE006Ef36BA678Ed201587E91200de47255c3d664";
    // Get an instance of the SaveERC20 contract using its ABI (ISaveERC20) and address
    const saveERC20 = await ethers.getContractAt("ISaveERC20", saveERC20ContractAddress);

    // Specify the amount of Web3CXI tokens to approve the SaveERC20 contract to spend
    const approvalAmount = ethers.parseUnits("1000", 18);

    // Approve the SaveERC20 contract to spend the specified amount of Web3CXI tokens on behalf of the caller
    const approveTx = await web3CXI.approve(saveERC20, approvalAmount);
    // Wait for the approval transaction to be mined
    approveTx.wait();

    // Retrieve the current balance of the SaveERC20 contract before making a deposit
    const contractBalanceBeforeDeposit = await saveERC20.getContractBalance();
    console.log("Contract balance before :::", contractBalanceBeforeDeposit);

    // Specify the amount of Web3CXI tokens to deposit into the SaveERC20 contract
    const depositAmount = ethers.parseUnits("150", 18);
    // Call the deposit function on the SaveERC20 contract
    const depositTx = await saveERC20.deposit(depositAmount);

    // Log the transaction details of the deposit
    console.log(depositTx);

    // Wait for the deposit transaction to be mined
    depositTx.wait();

    // Retrieve the balance of the SaveERC20 contract after the deposit
    const contractBalanceAfterDeposit = await saveERC20.getContractBalance();

    // Log the balance of the SaveERC20 contract after the deposit
    console.log("Contract balance after :::", contractBalanceAfterDeposit);

    // Specify the amount of Web3CXI tokens to withdraw from the SaveERC20 contract
    const widrawAmount = ethers.parseUnits("200", 18);
    // Call the withdraw function on the SaveERC20 contract
    const withdrawalTx = await saveERC20.withdraw(widrawAmount);
    // Log the transaction details of the withdrawal
    console.log(withdrawalTx);
    // Wait for the withdrawal transaction to be mined
    withdrawalTx.wait();

    // Retrieve the balance of the SaveERC20 contract after the withdrawal
    const contractBalanceAfterWithdrawal = await saveERC20.getContractBalance();

    // Log the balance of the SaveERC20 contract after the withdrawal
    console.log("Contract balance after withdrawal:::", contractBalanceAfterWithdrawal);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
