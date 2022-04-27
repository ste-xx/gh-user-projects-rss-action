import {FeedMap} from './types'
import {HttpClient} from '@actions/http-client'

const createQueryPartial = (user: string): string => `
  ${user}: search(query: "${user}", type: USER, first: 1) {
    edges {
      node {
        ... on Organization {
          repositories(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
            __typename
            edges {
              node {
                id
                name
                description
              }
            }
          }
        }
      }
    }
  }
`

interface GhUserProjectResponse {
  data: Record<
    string,
    {
      edges: {
        node: {
          repositories: {
            edges: {
              node: {
                id: string
                name: string
                description: string | null
              }
            }[]
          }
        }
      }[]
    }
  >
}

interface Input {
  names: string[]
  token: string
}

export const fetchData = async (input: Input): Promise<FeedMap> => {
  const query = `
      query {
        ${input.names.map(name => createQueryPartial(name)).join('\n')}
      }
    `

  const client = new HttpClient()
  const response = await client.postJson<GhUserProjectResponse>(
    'https://api.github.com/graphql',
    {
      query
    },
    {
      authorization: `Bearer ${input.token}`
    }
  )
  const result = response.result?.data ?? {}

  return Object.fromEntries(
    Object.entries(result).flatMap(([username, entry]) =>
      entry.edges.flatMap(e =>
        e.node.repositories.edges.map(({node: {id, name, description}}) => [
          id,
          {
            id,
            url: `https://github.com/${username}/${name}`,
            created: new Date().getTime(),
            title: `${username}: ${name}`,
            content_text: description ?? ''
          }
        ])
      )
    )
  )
}
