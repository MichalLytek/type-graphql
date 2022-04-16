import { GraphQLModule } from '@graphql-modules/core'
import * as path from 'path'
import { buildSchemaSync } from '../../../src'

import RecipeResolver from './recipe.resolver'
import UserResolver from './user.resolver'
import UserService from './user.service'
import Recipe from './recipe.type'

const resolvers = [RecipeResolver, UserResolver] as const

// @ts-expect-error
const UserModule = new GraphQLModule({
  providers: [UserService, ...resolvers],
  extraSchemas: [
    buildSchemaSync({
      resolvers,
      orphanedTypes: [Recipe],
      container: ({ context }) => UserModule.injector.getSessionInjector(context),
      skipCheck: true,
      emitSchemaFile: path.resolve(__dirname, 'user-schema.gql')
    })
  ]
})

export default UserModule
