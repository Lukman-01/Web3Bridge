import { useCallback, useEffect, useState } from "react";
import { Box } from "@radix-ui/themes";
import Layout from "./components/Layout";
import CreateProposalModal from "./components/CreateProposalModal";
import {
    useAppKitAccount,
    useAppKitProvider,
    useWalletInfo,
} from "@reown/appkit/react";
import Proposals from "./components/Proposals";
import useContract from "./hooks/useContract";
import useFetchProposals from "./hooks/useFetchProposals";


// const proposals = [
//     {
//         description: "Food",
//         amount: "1",
//         minRequiredVote: 5,
//         voteCount: 2,
//         deadline: 3600,
//         executed: false
//     },
//     {
//         description: "Random Desc",
//         amount: "1",
//         minRequiredVote: 5,
//         voteCount: 2,
//         deadline: 3600,
//         executed: false
//     },
//     {
//         description: "Some description",
//         amount: "1",
//         minRequiredVote: 5,
//         voteCount: 2,
//         deadline: 3600,
//         executed: false
//     },
// ]

function App() {
    const { walletProvider } = useAppKitProvider("eip155");
    const { walletInfo } = useWalletInfo();
    const { address, status, isConnected } = useAppKitAccount();
    console.log("walletInfo: ", walletInfo);
    console.log("walletInfo: ", address, status, isConnected);

    console.log("walletProvider: ", walletProvider, useAppKitProvider);

    const readOnlyProposalContract = useContract();
    // const [proposals, setProposals] = useState([]);

    const { proposals } = useFetchProposals();

    // const getProposals = useCallback(async () => {
    //     if(!readOnlyProposalContract) return;

    //     try {
    //         const proposalCount = Number(await readOnlyProposalContract.proposalCount());
    
    //         const proposalsId = Array.from({length: proposalCount}, (_, i) => i + 1);

    //         proposalsId.pop();
    
    //         proposalsId.forEach(async (proposalId) => {
    //             const proposalStruct = await readOnlyProposalContract.proposals(proposalId);
                
    //             // const target = {...proposalStruct}
    //             // const handler = {};
    //             // const proxy = new Proxy(target, handler);

    //             // {
    //                 // reference to the original target
    //                 // proxy.__target = target;
    
    //                 // unveil target
    //                 // console.log("Proxy", proxy.__target);
    //             // }

    //             setProposals((prevState) => [...prevState, {
    //                 description: proposalStruct.description,
    //                 amount: proposalStruct.amount,
    //                 minRequiredVote: proposalStruct.minVotesToPass,
    //                 voteCount: proposalStruct.voteCount,
    //                 deadline: proposalStruct.votingDeadline,
    //                 executed: proposalStruct.executed
    //             }])
    //             console.log("Proposal Struct:::", proposalStruct)
    //             console.log("Proposal object", {description: proposalStruct.description,
    //                 amount: proposalStruct.amount,
    //                 minRequiredVote: proposalStruct.minVotesToPass,
    //                 voteCount: proposalStruct.voteCount,
    //                 deadline: proposalStruct.votingDeadline,
    //                 executed: proposalStruct.executed})
    //         })
    //     } catch (error) {
    //         console.log("Error fetching proposals", error)
    //     }
    // }, [readOnlyProposalContract]);

    // useEffect(() => {
    //     getProposals();
    // }, [getProposals])

    return (
        <Layout>
            <Box className="flex justify-end p-4">
                <CreateProposalModal />
            </Box>
            <Box className="">
                <Proposals proposals={proposals} />
            </Box>
        </Layout>
    );
}

export default App;
