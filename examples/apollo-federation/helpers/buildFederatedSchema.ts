import { buildSchema, BuildSchemaOptions, createResolversMap } from "../../../src";
import gql from "graphql-tag";
import deepMerge from "lodash.merge";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { IResolvers, printSchemaWithDirectives } from "@graphql-tools/utils";

export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, "skipCheck">,
  referenceResolvers?: IResolvers,
) {
  // build TypeGraphQL schema
  const schema = await buildSchema({
    ...options,
    skipCheck: true, // disable check to allow schemas without query, etc.
  });

  // build Apollo Subgraph schema
  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql(printSchemaWithDirectives(schema)),
    // merge schema's resolvers with reference resolvers
    resolvers: deepMerge(createResolversMap(schema) as any, referenceResolvers),
  });

  return federatedSchema;
}
