import {
    loadFixture, time
} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("ERC20Staking", function(){

    async function  deployERC20() {
        const [owner] = await ethers.getSigners();
        
        const eRC20Token = await ethers.getContractFactory("ERC20Token");
        const tokenAddress = await eRC20Token.deploy();
        //console.log("ERC20 Token deployed to:", tokenAddress);

        return {tokenAddress};
    }

    async function  deployERC20Staking() {
        const [owner, otherAccount] = await ethers.getSigners();

        const {tokenAddress} = await loadFixture(deployERC20);
        const rewardRate = 2;

        const eRC20Staking = await ethers.getContractFactory("ERC20Staking") ;
        const stakingAddress = await eRC20Staking.deploy(tokenAddress, rewardRate) ;

        //console.log("eRC20Staking contract is deployed to :", stakingAddress);

        return {owner, otherAccount, tokenAddress, stakingAddress, rewardRate};
    }

    describe("The two contract deployments", function() {

        it("should check if owner is correct", async function() {
            const {stakingAddress, owner} = await loadFixture(deployERC20Staking);

            expect(await stakingAddress.owner()).to.equal(owner);
        });

        it("Should check if tokenAddress is correctly set", async function() {
            const{tokenAddress, stakingAddress} = await loadFixture(deployERC20Staking);

            expect(await stakingAddress.stakingToken(tokenAddress)).to.equal(tokenAddress);
        });

        it("Should check if rewardRate is correctly set", async function() {
            const{stakingAddress, rewardRate} = await loadFixture(deployERC20Staking);

            expect(await stakingAddress.rewardRate()).to.equal(rewardRate);
        });
    });

    describe ("Owner Deposit", function(){
        it("Should deposit succesfully", async () => {
            const {tokenAddress, stakingAddress, owner} = await loadFixture(deployERC20Staking);

            const amtToDeposit = ethers.parseUnits("100", 18);

            await tokenAddress.approve(stakingAddress, amtToDeposit);

            await expect(stakingAddress.deposit(amtToDeposit))
            .to.emit(stakingAddress, "Deposit")
            .withArgs(owner, amtToDeposit);

            expect(await tokenAddress.balanceOf(stakingAddress)).to.equal(amtToDeposit);
        });

        it("Should revert if a non-owner tries to deposit tokens", async () => {
            const {otherAccount, tokenAddress, stakingAddress, owner} = await loadFixture(deployERC20Staking);

            const amtToDeposit = ethers.parseUnits("100", 18);
            await tokenAddress.transfer(otherAccount, amtToDeposit);
            expect(await tokenAddress.balanceOf(otherAccount)).to.equal(amtToDeposit);

           const res = await tokenAddress.approve(stakingAddress, amtToDeposit);
            res.wait();
            
            await expect(stakingAddress.connect(otherAccount).deposit(amtToDeposit))
            .to.be.revertedWithCustomError(stakingAddress, "NotOwner");

        })
    });

    describe("Staking into the contract", function(){
        it("Should stake sucessfully", async () => {
            const {otherAccount, tokenAddress, stakingAddress, owner} = await loadFixture(deployERC20Staking);
            

        })
    })
})