import React, { createContext, ReactNode, useEffect, useState } from 'react'
import snapshot from '@snapshot-labs/snapshot.js'
import { useWeb3 } from 'src/hooks/useWeb3'
import { useBacklog } from 'src/hooks/useBacklog'
import { Vote } from 'src/types'
import { useBacklogContext } from 'src/hooks/useBacklogContext'

interface Props {
  children: ReactNode
}

interface VoteContextType {
  votingPower: number
  usedVotingPower: number
  userVotes: Array<{ number: Vote }>
  proposalVotesByUser: { [key: number]: number }
  backlogVotes: Array<Vote>
  vote: (vote: Vote) => Promise<boolean>
}

export const VoteContext = createContext<VoteContextType>({
  votingPower: 0,
  usedVotingPower: 0,
  userVotes: [],
  proposalVotesByUser: {},
  backlogVotes: [],
  vote: async () => false,
})

export function VoteContextProvider(props: Props) {
  const web3Context = useWeb3()
  const backlog = useBacklog()
  const backlogContext = useBacklogContext()
  const initialState = {
    votingPower: 0,
    usedVotingPower: 0,
    userVotes: [],
    proposalVotesByUser: {},
    backlogVotes: backlog.items.flatMap(i => i.votes),
    vote,
  }
  const [context, setContext] = useState(initialState)

  useEffect(() => {
    async function updateContext() {
      let votingPower = 0
      let usedVotingPower = 0
      let userVotes = []
      let proposalVotesByUser = {}
      const backlogVotes = backlog.items.flatMap(i => i.votes)

      if (web3Context.address && backlog.settings?.strategy) {
        votingPower = await getVotingPower()
        userVotes = backlogVotes.filter((i) => i.address === web3Context.address)
        usedVotingPower = userVotes
          .map((i) => i.amount)
          .reduce((a, b) => a + b, 0)
        userVotes.map((i) => {
          proposalVotesByUser.hasOwnProperty(i.number)
            ? (proposalVotesByUser[i.number] += i.amount)
            : (proposalVotesByUser[i.number] = i.amount)
        })
      }

      setContext({
        ...context,
        votingPower,
        usedVotingPower,
        userVotes,
        proposalVotesByUser,
        backlogVotes,
      })
    }

    updateContext()
  }, [web3Context.address, backlog.settings, backlog.items])

  async function vote(vote: Vote): Promise<boolean> {
    console.log('VOTE #', vote.number)

    const updatedBacklog = {
      ...backlog,
    }

    await fetch('/api/votes', {
      method: 'POST',
      body: JSON.stringify(vote),
    })

    const itemIndex = updatedBacklog.items.findIndex(i => i.number === vote.number)
    updatedBacklog.items[itemIndex].votes = [...updatedBacklog.items[itemIndex].votes, vote]
    updatedBacklog.items[itemIndex].totalVoteValue = updatedBacklog.items[itemIndex].votes.reduce((value, vote) => value + vote.amount, 0),
    updatedBacklog.items[itemIndex].totalVoteCount = updatedBacklog.items[itemIndex].votes.length
    backlogContext.setBacklog(updatedBacklog)

    return true
  }

  async function getVotingPower(): Promise<number> {
    const space = ''
    const strategies = backlog.settings.strategy
    const blockNumber = backlog.settings.blockNumber || ''
    const network = backlog.settings.chainId.toString();
    const voter = [web3Context.address]
    try {
      const scores = await snapshot.utils.getScores(
        space,
        strategies,
        network,
        voter,
        blockNumber
      )
      let totalScore = 0
      scores.map(
        (score) => {
          totalScore += (score[web3Context.address] || 0)
        }
      )
      return totalScore
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <VoteContext.Provider value={context}>
      {props.children}
    </VoteContext.Provider>
  )
}
