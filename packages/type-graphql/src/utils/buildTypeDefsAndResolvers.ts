import type { GraphQLSchema } from "graphql";
import { printSchema } from "graphql";
import type { BuildSchemaOptions } from "./buildSchema";
import { buildSchema, buildSchemaSync } from "./buildSchema";
import { createResolversMap } from "./createResolversMap";

function createTypeDefsAndResolversMap(schema: GraphQLSchema) {
  const typeDefs = printSchema(schema);
  const resolvers = createResolversMap(schema);
  return { typeDefs, resolvers };
}

export async function buildTypeDefsAndResolvers(options: BuildSchemaOptions) {
  const schema = await buildSchema(options);
  return createTypeDefsAndResolversMap(schema);
}

export function buildTypeDefsAndResolversSync(options: BuildSchemaOptions) {
  const schema = buildSchemaSync(options);
  return createTypeDefsAndResolversMap(schema);
}
