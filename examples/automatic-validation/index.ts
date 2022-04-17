import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from '../../src'

import { RecipeResolver } from './recipe-resolver'

async function bootstrap(): Promise<void> {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver]
  })

  // Create GraphQL server
  const server = new ApolloServer({ schema })

  // Start the server
  const { url } = await server.listen(4000)
  console.log(`Server is running, GraphQL Playground available at ${url}`)
}

bootstrap().catch(err => console.error(err))
