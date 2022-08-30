import { Box, Dialog, Flex, Truncate } from '@primer/components'
import { ChevronUpIcon } from '@primer/styled-octicons'
import moment from 'moment'
import React, { useState } from 'react'

import { PRIMARY_COLOR } from 'src/utils/constants'
import { AddressAvatars } from './AddressAvatars'
import { Link } from './elements/Link'
import { ItemVote } from './ItemVote'
import { BacklogItem } from '../types/BacklogItem'

interface Props {
  item:BacklogItem
  length: number
  index: number
}

export function ItemCard(props: Props) {
  const { item, length, index } = props
  const [showDialog, setShowDialog] = useState(false)
  const returnFocusRef = React.useRef(null)
  const lastItem = length === index + 1
  const addresses = [...new Set(item.votes.flatMap((i) => i.address))]

  return (
    <React.Fragment key={item.number}>
      <Dialog
        css=""
        returnFocusRef={returnFocusRef}
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">
          <Truncate
            title={item.title}
            inline
            expandable={false}
            maxWidth="100%"
            className="mr-4"
          >
            #{item.number} {item.title}
          </Truncate>
        </Dialog.Header>
        <Box p={3}>
          <ItemVote number={item.number} />
        </Box>
      </Dialog>
      <Box className={lastItem ? '' : 'border-bottom'}>
        <Flex alignItems="flex-start" className="m-2">
          <Flex
            ref={returnFocusRef}
            width={80}
            flexShrink={0}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            className="border"
            onClick={() => setShowDialog(true)}
          >
            <ChevronUpIcon
              size={24}
              aria-label={'Vote on item #' + item.number}
              color={PRIMARY_COLOR}
            />
            <span>{item.totalVoteValue}</span>
          </Flex>
          <Flex flexGrow={1} className="mx-4" flexDirection="column">
            <Flex justifyContent="space-between">
              <Link className="f4 text-bold" to={item.url}>
                <Truncate
                  title={item.title}
                  inline
                  expandable={false}
                  maxWidth="100%"
                >
                  {item.title}
                </Truncate>
              </Link>
            </Flex>
            <Truncate title={item.description} inline maxWidth="100%">
              {item.description}
            </Truncate>
            <p className="pt-1 mb-0 text-small color-text-tertiary">
              #{item.number} opened {moment(item.created).fromNow()} by{' '}
              {item.author}
            </p>
            {item.totalVoteCount > 0 && (
              <div className="mt-3">
                <AddressAvatars
                  addresses={addresses}
                  totalVoteCount={item.totalVoteCount}
                />
              </div>
            )}
          </Flex>
        </Flex>
      </Box>
    </React.Fragment>
  )
}
