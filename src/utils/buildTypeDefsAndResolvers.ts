import { printSchema } from "graphql";

import { BuildSchemaOptions, buildSchema } from "./buildSchema";
import { createResolversMap } from "./createResolversMap";

export async function buildTypeDefsAndResolvers(options: BuildSchemaOptions) {
  const schema = await buildSchema(options);
  const typeDefs = printSchema(schema);
  const resolvers = createResolversMap(schema);
  return { typeDefs, resolvers };
}
