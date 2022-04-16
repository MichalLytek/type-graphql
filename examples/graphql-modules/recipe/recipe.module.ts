import { GraphQLModule } from '@graphql-modules/core'
import * as path from 'path'
import { buildSchemaSync } from '../../../src'

import RecipeResolver from './recipe.resolver'
import UserResolver from './user.resolver'
import RecipeService from './recipe.service'
import User from './user.type'

const resolvers = [RecipeResolver, UserResolver] as const

// @ts-expect-error
const RecipeModule = new GraphQLModule({
  providers: [RecipeService, ...resolvers],
  extraSchemas: [
    buildSchemaSync({
      resolvers,
      orphanedTypes: [User],
      container: ({ context }) => RecipeModule.injector.getSessionInjector(context),
      skipCheck: true,
      emitSchemaFile: path.resolve(__dirname, 'recipe.schema.gql')
    })
  ]
})

export default RecipeModule
