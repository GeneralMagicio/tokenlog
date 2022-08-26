import { Button, ButtonPrimary, TextInput } from '@primer/components'
import React, { useState } from 'react'

interface Props {
  number: number
  votingPower: number
  proposalVotes: { [key: number]: number }
  loading?: boolean
  onSubmit: (value: number) => Promise<boolean>
}

export function QuadraticVote(props: Props) {
  const step = 1
  const itemCost = props.proposalVotes.hasOwnProperty(props.number)
    ? props.proposalVotes[props.number]
    : 0
  const usedVotingPower = Object.values(props.proposalVotes).reduce(
    (vote1: number, vote2: number) => vote1 + getQuadraticCost(vote2),
    0
  )
  const maxVotes = Math.floor(props.votingPower - usedVotingPower)
  const [voteAmount, setVoteAmount] = useState(step)
  const [quadraticCost, setQuadraticCost] = useState(
    getQuadraticCost(itemCost + step)
  )

  async function onSubmit() {
    if (await props.onSubmit(voteAmount)) {
      setQuadraticCost(getQuadraticCost(itemCost + 2 * voteAmount))
    }
  }

  function onChangeStep(type: 'MIN' | 'DOWN' | 'UP' | 'MAX') {
    let amount: number
    let qc: number

    if (type === 'MIN') {
      amount = step
      qc = getQuadraticCost(itemCost + step)
    }
    if (type === 'DOWN') {
      amount = voteAmount - step
      qc = getQuadraticCost(amount + itemCost)
    }
    if (type === 'UP') {
      amount = voteAmount + step
      qc = getQuadraticCost(amount + itemCost)
    }
    if (type === 'MAX') {
      amount = voteAmount
      qc = getQuadraticCost(amount + itemCost)

      while (getQuadraticCost(amount + itemCost) <= maxVotes) {
        qc = getQuadraticCost(amount + itemCost)
        amount = amount + step
      }

      amount = amount - step
    }

    setVoteAmount(amount)
    setQuadraticCost(qc)
  }

  function onChangeInput(event) {
    const targetValue = event.target.value
    const amount =
      targetValue < 1
        ? 1
        : targetValue > maxVotes
        ? Math.floor(maxVotes)
        : parseInt(targetValue)
    const qc = getQuadraticCost(amount)
    setVoteAmount(amount)
    setQuadraticCost(qc)
  }

  function disableLower() {
    return voteAmount <= step
  }

  function disableHigher() {
    return maxVotes <= getQuadraticCost(voteAmount + itemCost + 1)
  }

  function disableSubmit() {
    return quadraticCost > maxVotes || props.loading
  }

  function getQuadraticCost(value: number): number {
    return Number(Math.pow(value, 2).toFixed(2))
  }

  return (
    <div>
      <p>
        You can spend a maximum of {Math.max(maxVotes, 0)} voting power ('VP').
      </p>
      <p>
        You already have {itemCost} votes ({getQuadraticCost(itemCost)} VP) on
        this item.
      </p>
      {quadraticCost > maxVotes && (
        <p className="color-text-warning">
          <span
            className="tooltipped tooltipped-n"
            aria-label="Does not meet accessibility standards"
          >
            ⚠️
          </span>
          <span className="ml-1">Not enough voting power left.</span>
        </p>
      )}
      <p>
        <Button
          css=""
          className="mr-2"
          variant="small"
          disabled={disableLower()}
          onClick={() => onChangeStep('MIN')}
        >
          MIN
        </Button>
        <Button
          css=""
          className="mr-2"
          variant="small"
          disabled={disableLower()}
          onClick={() => onChangeStep('DOWN')}
        >
          &laquo;
        </Button>
        <TextInput
          css=""
          variant="small"
          type="number"
          width={100}
          aria-label="Amount of votes"
          name="votes"
          placeholder="Amount of votes..."
          value={voteAmount}
          onChange={onChangeInput}
        />
        <Button
          css=""
          className="ml-2"
          variant="small"
          disabled={disableHigher()}
          onClick={() => onChangeStep('UP')}
        >
          &raquo;
        </Button>
        <Button
          css=""
          className="ml-2"
          variant="small"
          disabled={disableHigher()}
          onClick={() => onChangeStep('MAX')}
        >
          MAX
        </Button>
      </p>
      <p>
        <ButtonPrimary css="" disabled={disableSubmit()} onClick={onSubmit}>
          Submit
        </ButtonPrimary>
        <small className="ml-2">
          * This vote will cost you {quadraticCost - getQuadraticCost(itemCost)}{' '}
          VP. Which will bring you to a total of {voteAmount + itemCost} votes
          for {getQuadraticCost(voteAmount + itemCost)} VP
        </small>
      </p>
    </div>
  )
}
