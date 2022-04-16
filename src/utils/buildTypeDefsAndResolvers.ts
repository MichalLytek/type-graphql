import { GraphQLSchema, printSchema } from 'graphql'

import { buildSchema, BuildSchemaOptions, buildSchemaSync } from './buildSchema'
import { createResolversMap } from './createResolversMap'

export async function buildTypeDefsAndResolvers(options: BuildSchemaOptions) {
  const schema = await buildSchema(options)
  return createTypeDefsAndResolversMap(schema)
}

export function buildTypeDefsAndResolversSync(options: BuildSchemaOptions) {
  const schema = buildSchemaSync(options)
  return createTypeDefsAndResolversMap(schema)
}

function createTypeDefsAndResolversMap(schema: GraphQLSchema) {
  const typeDefs = printSchema(schema)
  const resolvers = createResolversMap(schema)
  return { typeDefs, resolvers }
}
