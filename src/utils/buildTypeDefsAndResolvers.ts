import { GraphQLSchema } from 'graphql'

import { buildSchema, BuildSchemaOptions, buildSchemaSync } from './buildSchema'
import { createResolversMap } from './createResolversMap'
import { ResolversMap } from '../interfaces'
import { printSchemaWithDirectives } from '@graphql-tools/utils'

export async function buildTypeDefsAndResolvers(
  options: BuildSchemaOptions
): Promise<{ typeDefs: string; resolvers: ResolversMap<any, any> }> {
  const schema = await buildSchema(options)
  return createTypeDefsAndResolversMap(schema)
}

export function buildTypeDefsAndResolversSync(options: BuildSchemaOptions): {
  typeDefs: string
  resolvers: ResolversMap<any, any>
} {
  const schema = buildSchemaSync(options)
  return createTypeDefsAndResolversMap(schema)
}

function createTypeDefsAndResolversMap(schema: GraphQLSchema): { typeDefs: string; resolvers: ResolversMap<any, any> } {
  const typeDefs = printSchemaWithDirectives(schema)
  const resolvers = createResolversMap(schema)
  return { typeDefs, resolvers }
}
