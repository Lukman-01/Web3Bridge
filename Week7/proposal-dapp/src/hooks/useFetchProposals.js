import { useCallback, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { Interface, parseEther, Contract } from "ethers";
import useRunners from "./useRunners";
import proposalAbi from "../ABI/proposal.json";
import multicallAbi from "../ABI/multicall2.json";
import { multicallAddress } from '../constants/multicallAddress'

const useFetchProposals = () => {
    const readOnlyProposalContract = useContract();
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();

    const [proposals, setProposals] = useState([]);

    const intfce = useMemo(() => new Interface(proposalAbi), []);
    const { readOnlyProvider } = useRunners();

    const getProposals = useCallback(async () => {
        if(!readOnlyProposalContract) return;

        try {
            const proposalCount = Number(await readOnlyProposalContract.proposalCount());
    
            const proposalsId = Array.from({length: proposalCount}, (_, i) => i + 1);

            proposalsId.pop();

            const calls = proposalsId.map((id) => ({
                target: import.meta.env.VITE_CONTRACT_ADDRESS,
                callData: intfce.encodeFunctionData("proposals", [id]),
            }));

            const multicall = new Contract(
                multicallAddress,
                multicallAbi,
                readOnlyProvider
            );
        
            // eslint-disable-next-line no-unused-vars
            const [_, proposalsResult] = await multicall.aggregate.staticCall(calls);
    
            // console.log("Multicall Proposals:::",proposalsResult);

            const decodedProposals = proposalsResult.map((result) =>
                intfce.decodeFunctionResult("proposals", result)
            );
        
            // console.log("Fetched Proposals", decodedProposals);

            const data = decodedProposals.map((proposalStruct, index) => ({
                proposalId: proposalsId[index],
                description: proposalStruct.description,
                amount: proposalStruct.amount,
                minRequiredVote: proposalStruct.minVotesToPass,
                voteCount: proposalStruct.voteCount,
                deadline: proposalStruct.votingDeadline,
                executed: proposalStruct.executed,
            }));

            // const data = {
            //     description: decodedProposals.description,
            //         amount: decodedProposals.amount,
            //         minRequiredVote: decodedProposals.minVotesToPass,
            //         voteCount: decodedProposals.voteCount,
            //         deadline: decodedProposals.votingDeadline,
            //         executed: decodedProposals.executed
            // }
            // console.log("DATA:::", data)
            // setProposals(decodedProposals); 
            setProposals(data)
            // setIsFetchingProposals(false);
    
            // proposalsId.forEach(async (proposalId) => {
            //     const proposalStruct = await readOnlyProposalContract.proposals(proposalId);
                
            //     // const target = {...proposalStruct}
            //     // const handler = {};
            //     // const proxy = new Proxy(target, handler);

            //     // {
            //         // reference to the original target
            //         // proxy.__target = target;
    
            //         // unveil target
            //         // console.log("Proxy", proxy.__target);
            //     // }

            //     setProposals((prevState) => [...prevState, {
            //         description: proposalStruct.description,
            //         amount: proposalStruct.amount,
            //         minRequiredVote: proposalStruct.minVotesToPass,
            //         voteCount: proposalStruct.voteCount,
            //         deadline: proposalStruct.votingDeadline,
            //         executed: proposalStruct.executed
            //     }])
            //     console.log("Proposal Struct:::", proposalStruct)
            //     console.log("Proposal object", {description: proposalStruct.description,
            //         amount: proposalStruct.amount,
            //         minRequiredVote: proposalStruct.minVotesToPass,
            //         voteCount: proposalStruct.voteCount,
            //         deadline: proposalStruct.votingDeadline,
            //         executed: proposalStruct.executed})
            // })
        } catch (error) {
            console.log("Error fetching proposals", error)
        }
    }, [readOnlyProposalContract, intfce, readOnlyProvider]);

    useEffect(() => {
        getProposals();

        const proposalCreationFilter = readOnlyProposalContract.filters.ProposalCreated();
        const votingFilter = readOnlyProposalContract.filters.Voted();

        readOnlyProposalContract.on(proposalCreationFilter, getProposals)
        // readOnlyProposalContract.on(proposalCreationFilter, (event) => {
        //     // console.log("EVENT", event.args.description)
        //     // const proposal = event.args
        //     // const newObj = {
        //     //     proposalId: proposal.proposalsId,
        //     //     description: proposal.description,
        //     //     amount: proposal.amount,
        //     //     minRequiredVote: proposal.minVotesToPass,
        //     //     voteCount: proposal.voteCount,
        //     //     deadline: proposal.votingDeadline
        //     // }
        //     // console.log("NEW OBJ", newObj)
        //     // setProposals((prevProposals) => [...prevProposals, newObj])
        //     getProposals();
        // });

        // readOnlyProposalContract.on("ProposalCreated", (value) => {
        //     console.log("Proposal Creation Value:::", value);

        //     getProposals();
        // })

        readOnlyProposalContract.on(votingFilter, getProposals)

        return () => {
            readOnlyProposalContract.removeAllListeners(proposalCreationFilter, getProposals);
            readOnlyProposalContract.removeAllListeners(votingFilter, getProposals);
        };
        
      }, [intfce, readOnlyProposalContract]);
    
      return { proposals };
};

export default useFetchProposals;
