import { Box, Flex, Text } from '@radix-ui/themes'
import React from 'react'
import Proposal from './Proposal'

const Proposals = ({proposals}) => {
  return (
    <Box className='w-full grid grid-cols-3 p-8 gap-2'>
        {proposals.length === 0 ? (
            <Text>No data to display</Text>
        ) : (
            proposals.map((proposal) => (
                <Proposal key={proposal.proposalId} proposal={proposal} />
            ))
        )}
    </Box>
  )
}

export default Proposals