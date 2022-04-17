import 'reflect-metadata'
import Container from 'typedi'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from '../../src'

import { RecipeResolver } from './recipe/recipe.resolver'
import { ResolveTimeMiddleware } from './middlewares/resolve-time'
import { ErrorLoggerMiddleware } from './middlewares/error-logger'
import { Context } from './context'

async function bootstrap(): Promise<void> {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    globalMiddlewares: [ErrorLoggerMiddleware, ResolveTimeMiddleware],
    container: Container
  })

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    context: (): Context => {
      return {
        // example user
        currentUser: {
          id: 123,
          name: 'Sample user'
        }
      }
    }
  })

  // Start the server
  const { url } = await server.listen(4000)
  console.log(`Server is running, GraphQL Playground available at ${url}`)
}

bootstrap().catch(err => console.error(err))
