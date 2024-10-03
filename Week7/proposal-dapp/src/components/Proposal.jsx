import React, { useContext } from 'react';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import useVoteProposal from '../hooks/useVoteProposal';
import { formatEther } from 'ethers';
import { AppContext } from '../context/AppContext';

const Proposal = ({
    proposal,
    key
}) => {
    const date = new Date(Number(proposal.deadline))

    // const { isLoading } = useVoteProposal();
    const {isLoading} = useContext(AppContext)
    const handleVoteProposal = useVoteProposal();

    // console.log("PROPOSAL", proposal)

  return (
    <Box key={proposal?.proposalId} className="w-full bg-blue-400 rounded-md p-6">
        <Text className='text-3xl pb-4'>Proposal</Text>
        <Box className='w-full'>
            <Flex>
                <Text className='text-base font-semibold text-gray-600 text-nowrap text-ellipsis'>Description: </Text>
                <Text className='text-xl'>{proposal?.description}</Text>
            </Flex>
            <Flex>
                <Text className='text-base font-semibold text-gray-600'>Min. Required Votes: </Text>
                <Text>{Number(proposal?.minRequiredVote)}</Text>
            </Flex>
            <Flex>
                <Text className='text-base font-semibold text-gray-600'>Vote Count: </Text>
                <Text>{Number(proposal?.voteCount)}</Text>
                {/* <Text>{BigNumber}</Text> */}
            </Flex>
            <Flex>
                <Text className='text-base font-semibold text-gray-600'>Deadline: </Text>
                <Text>{date.toLocaleString("en-US", {year: 'numeric', month: '2-digit', day: '2-digit'})}</Text>
            </Flex>
            <Flex>
                <Text className='text-base font-semibold text-gray-600'>Amount: </Text>
                <Text>{formatEther(proposal?.amount)} ETH</Text>
            </Flex>

            <Box className='pt-4'>
                <Button disabled={isLoading} onClick={() => handleVoteProposal(proposal.proposalId)} className='w-full rounded-md bg-white text-bue-400 py-4'>{isLoading ? "...":"Vote"}</Button>
            </Box>
        </Box>
    </Box>
  )
}

export default Proposal