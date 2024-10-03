import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { parseEther } from "ethers";
import { AppContext } from "../context/AppContext";

const useCreateProposal = () => {
    const contract = useContract(true);
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();

    const {setIsCreatingProposals} = useContext(AppContext)

    return useCallback(
        async (description, recipient, amount, deadline, minVote) => {
            if (
                !description ||
                !recipient ||
                !amount ||
                !deadline ||
                !minVote
            ) {
                toast.error("Missing field(s)");
                return;
            }
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
                setIsCreatingProposals(true)
                const estimatedGas = await contract.createProposal.estimateGas(
                    description,
                    recipient,
                    parseEther(amount),
                    deadline,
                    minVote
                );
                const tx = await contract.createProposal(
                    description,
                    recipient,
                    parseEther(amount),
                    deadline,
                    minVote,
                    {
                        gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
                    }
                );
                const reciept = await tx.wait();

                setIsCreatingProposals(false)
                if (reciept.status === 1) {
                    toast.success("Proposal Creation successful");
                    return;
                }
                toast.error("Proposal Creation failed");
                return;
            } catch (error) {
                setIsCreatingProposals(false)
                console.error("error while creating proposal: ", error);
                toast.error("Proposal Creation errored");
            }
        },
        [address, chainId, contract]

    );

};

export default useCreateProposal;
