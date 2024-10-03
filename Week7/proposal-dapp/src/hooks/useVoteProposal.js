import { useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { parseEther } from "ethers";
import { AppContext } from "../context/AppContext";

const useVoteProposal = () => {
    const contract = useContract(true);
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();

    // const [isLoading, setIsLoading] = useState(false);
    const { setIsLoading } = useContext(AppContext)

    return useCallback(async (proposalId) => {
        // if (
        //     !description ||
        //     !recipient ||
        //     !amount ||
        //     !deadline ||
        //     !minVote
        // ) {
        //     toast.error("Missing field(s)");
        //     return;
        // }
        if (!address) {
            toast.error("Connect your wallet!");
            return;
        }
        if (Number(chainId) !== liskSepoliaNetwork.chainId) {
            toast.error("You are not connected to the right network");
            return;
        }

        if (!contract) {
            toast.error("Cannot get contract!");
            return;
        }

        try {
            setIsLoading(true)
            const estimatedGas = await contract.vote.estimateGas(
                proposalId
            );

            const tx = await contract.vote(
                proposalId,
                {
                    gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
                }
            );
            setIsLoading(false);
            const receipt = await tx.wait();

            if (receipt.status === 1) {
                toast.success("Proposal Vote successful");
                return;
            }
            toast.error("Proposal Vote Failed");
            return;
        } catch (error) {
            setIsLoading(false);
            console.error("error while voting on a proposal: ", error);
            toast.error("Proposal Vote error");
        }
    },
    [address, chainId, contract]
    );

    // return { isLoading }
};

export default useVoteProposal;
