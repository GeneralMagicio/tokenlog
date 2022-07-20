import React, { createContext, ReactNode, useEffect, useState } from 'react'
import snapshot from '@snapshot-labs/snapshot.js'
import { getQuadraticCost } from '../components/QuadraticVote'
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
  userVotes: Array<Vote>,
  backlogVotes: Array<Vote>,
  vote: (vote: Vote) => Promise<boolean>
}

export const VoteContext = createContext<VoteContextType>({
  votingPower: 0,
  usedVotingPower: 0,
  userVotes: [],
  backlogVotes: [],
  vote: async () => false,
})

export function VoteContextProvider(props: Props) {
  const web3Context = useWeb3()
  const backlog = useBacklog()
  const backlogContext = useBacklogContext()
  const initialVotes = backlog.items.flatMap(i => i.votes)
  const initialState = {
    votingPower: 0,
    usedVotingPower: 0,
    userVotes: initialVotes.filter((i) => i.address === web3Context.address),
    backlogVotes: backlog.items.flatMap(i => i.votes),
    vote,
  }
  const [context, setContext] = useState(initialState)

  useEffect(() => {
    async function updateContext() {
      let votingPower = 0
      let usedVotingPower: any = 0
      let userVotes = []
      let proposalVotes = {}
      const backlogVotes = backlog.items.flatMap(i => i.votes)
      
      if (web3Context.address && backlog.settings?.strategy) {
        votingPower = await getVotingPower()
        userVotes = backlogVotes.filter((i) => i.address === web3Context.address)
        userVotes.map((i) => {
          proposalVotes.hasOwnProperty(i.number)
            ? (proposalVotes[i.number] += i.amount)
            : (proposalVotes[i.number] = i.amount)
        })
        usedVotingPower = Object.values(proposalVotes).reduce(
          (vote1: number, vote2: number) => vote1 + getQuadraticCost(vote2),
          0
        )
      }

      setContext({
        ...context,
        votingPower,
        usedVotingPower,
        userVotes,
        backlogVotes
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
    const scores = await snapshot.utils.getScores(
      '',
      backlog.settings.strategy,
      web3Context.network.chainId.toString(),
      web3Context.provider,
      [web3Context.address]
    )

    return scores[0][web3Context.address]
  }

  return (
    <VoteContext.Provider value={context}>
      {props.children}
    </VoteContext.Provider>
  )
}
