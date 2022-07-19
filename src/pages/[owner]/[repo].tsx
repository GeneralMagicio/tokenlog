import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Backlog } from 'src/types'
import { DEFAULT_CACHE_REVALIDATE } from 'src/utils/constants'
import { GithubService } from 'src/services/github/service'
import { TokenlogService } from 'src/services/tokenlog'
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

export const getStaticPaths: GetStaticPaths = async () => {
  const repository = Create()
  const service = new TokenlogService(repository)
  const ids = await service.GetBacklogs()

  const paths = ids
    .map((backlog: Backlog) => {
      if (backlog.type === 'github') {
        const owner = backlog.id.replace('github:', '').split('/')[0]
        const repo = backlog.id.replace('github:', '').split('/')[1]

        return {
          params: { owner: owner, repo: repo },
        }
      }
    })
    .filter((i) => !!i)

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
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
    revalidate: DEFAULT_CACHE_REVALIDATE,
  }
}
