import { ethers } from "hardhat";

async function main() {

    // const factoryContractAddr = "0x80345491d7A4e513cafB4fE995750fbe0De4D794";
    // const tokenAddr = "0xe3C17c44D9A4b142D2E44E61c71987f0eF8b61b9";

    const factoryContractAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const tokenAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const factoryContract = await ethers.getContractAt("IMultisigFactory", factoryContractAddr);
    const tokenContract = await ethers.getContractAt("IToken", tokenAddr);

    const quorum = 3
    //const [owner, acc1, acc2] = ["0x596BB27ceF5e94aEcA5Ba50E41Db077b1c23068B", "0xfd558120F12C855ba1C31E157741D39650Bd5DA9", "0x0FC46aC63C1d6e19c85E2e9B4273C5e2B2759df4"];
    //const validSigner = [owner, acc1, acc2]
    const [owner, acc1, acc2, acc3] = await ethers.getSigners();
    const validSigner = [owner,acc1, acc2];

    const singleSig = await factoryContract.createMultisigWallet(quorum, validSigner);
    const res = await singleSig.wait();

    console.log("tx hash: ", res);

    const clones = await factoryContract.getMultiSigClones();
    console.log("clones: ", clones);

    const multisig1 = clones[0];
    const sig1 = await ethers.getContractAt("IMultiSig", multisig1);

    const amountToTransfer = ethers.parseUnits("10", 18);
    await tokenContract.transfer(sig1, amountToTransfer);

    const amt = ethers.parseUnits("5", 18);
    //await tokenContract.approve(sig1, amountToTransfer);

    const trf = await sig1.transfer(amt, acc1, tokenContract);
    const resp = await trf.wait();
    console.log(resp);

    const txId = 1;

    const approvetx1 = await sig1.connect(acc1).approveTx(txId);
    const app1 = approvetx1.wait();

    const approvetx2 = await sig1.connect(acc2).approveTx(txId);
    const app2 = approvetx2.wait();
    console.log("app2");
    

    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});