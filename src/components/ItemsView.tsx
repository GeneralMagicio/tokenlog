import {
  ButtonPrimary,
  Flex,
  TextInput,
} from '@primer/components'
import {
  SearchIcon,
} from '@primer/styled-octicons'
import moment from 'moment'
import React, { ChangeEvent, useState } from 'react'
import { useBacklog } from 'src/hooks/useBacklog'
import { BacklogItem } from 'src/types'
import { Link } from './elements/Link'
import { NoItemsFound } from './NoItemsFound'
import { NoOpenItems } from './NoOpenItems'
import { ItemCard } from './ItemCard'

export function ItemsView() {
  const backlog = useBacklog()
  const [searchValue, setSearchValue] = useState('')
  const [items, setItems] = useState(() => {
    return backlog.items.sort((a, b) => {
      return a.totalVoteValue <= b.totalVoteValue ? 1 : -1
    })
  })
  
  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchValue(value)

    if (!value) {
      setItems(backlog.items)
      return
    }

    const filtered = backlog.items.filter((i) =>
      i.title.toLowerCase().includes(value.toLowerCase())
    )
    setItems(filtered)
  }

  function newItemLink() {
    if (backlog.type === 'github') {
      return backlog.url + '/issues/new/choose'
    }

    return backlog.url
  }

  return (
    <div>
      <Flex justifyContent="space-between">
        <TextInput
          css=""
          variant="small"
          icon={SearchIcon}
          aria-label="Search items"
          name="search"
          placeholder="Search items.."
          onChange={onSearch}
        />
        <ButtonPrimary css="" variant="small">
          <Link to={newItemLink()}>New item</Link>
        </ButtonPrimary>
      </Flex>

      <div className="Box mt-4">
        {backlog.items.length === 0 && <NoOpenItems />}
        {items.length === 0 && <NoItemsFound criteria={searchValue} />}
        {items.map((i: BacklogItem, index: number) => {
          return <ItemCard index={index} length={items.length} item={i} />
        })}
      </div>
    </div>
  )
}
