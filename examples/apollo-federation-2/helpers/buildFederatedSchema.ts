import { buildSubgraphSchema } from "@apollo/subgraph";
import { type IResolvers, printSchemaWithDirectives } from "@graphql-tools/utils";
import gql from "graphql-tag";
import deepMerge from "lodash.merge";
import { type BuildSchemaOptions, buildSchema, createResolversMap } from "type-graphql";

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
    typeDefs: gql`
      extend schema
        @link(
          url: "https://specs.apollo.dev/federation/v2.3"
          import: [
            "@key"
            "@shareable"
            "@provides"
            "@extends"
            "@requires"
            "@external"
            "@interfaceObject"
          ]
        )
      ${printSchemaWithDirectives(schema)}
    `,
    // merge schema's resolvers with reference resolvers
    resolvers: deepMerge(createResolversMap(schema) as any, referenceResolvers),
  });

  return federatedSchema;
}
