import React from 'react'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Backlog } from 'src/types'
import { GithubService } from 'src/services/github/service'
import { Create } from 'src/repository/factory'
import { BacklogLayout } from 'src/components/layouts/Backlog'
import { BacklogContextProvider } from 'src/context/backlog-context'
import { VoteContextProvider } from 'src/context/vote-context'

interface Props {
  backlog: Backlog
}

interface Params extends ParsedUrlQuery {
  owner: string
  repo: string
}

export default function BacklogPage(data: Props) {
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <BacklogContextProvider backlog={data.backlog}>
      <VoteContextProvider>
        <BacklogLayout />
      </VoteContextProvider>
    </BacklogContextProvider>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const repository = Create()
  const service = new GithubService(repository)
  const id = `github:${context.params.owner}/${context.params.repo}`
  const backlog = await service.GetBacklog(id)
  backlog.items = await service.GetBacklogItems(id)

  if (!backlog) {
    return {
      props: null,
      notFound: true,
    }
  }

  return {
    props: {
      backlog: backlog,
    },
  }
}
