import { printSchema } from "graphql";

import { BuildSchemaOptions, buildSchema, buildSchemaSync } from "./buildSchema";
import { createResolversMap } from "./createResolversMap";

export async function buildTypeDefsAndResolvers(options: BuildSchemaOptions) {
  const schema = await buildSchema(options);
  return commonBuild(schema);
}

export function buildTypeDefsAndResolversSync(options: BuildSchemaOptions) {
  const schema = buildSchemaSync(options);
  return commonBuild(schema);
}

function commonBuild(schema) {
  const typeDefs = printSchema(schema);
  const resolvers = createResolversMap(schema);
  return { typeDefs, resolvers };
}
