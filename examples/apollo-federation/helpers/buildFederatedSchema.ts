import { buildSubgraphSchema } from "@apollo/subgraph";
import type { IResolvers } from "@graphql-tools/utils";
import { printSchemaWithDirectives } from "@graphql-tools/utils";
import gql from "graphql-tag";
import deepMerge from "lodash.merge";
import type { BuildSchemaOptions } from "type-graphql";
import { buildSchema, createResolversMap } from "type-graphql";

export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, "skipCheck">,
  referenceResolvers?: IResolvers,
) {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    ...options,
    // Disable check to allow schemas without query, etc...
    skipCheck: true,
  });

  // Build Apollo Subgraph schema
  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql(printSchemaWithDirectives(schema)),
    // Merge schema's resolvers with reference resolvers
    resolvers: deepMerge(createResolversMap(schema) as any, referenceResolvers),
  });

  return federatedSchema;
}
