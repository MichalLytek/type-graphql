import { ApolloClient, InMemoryCache, Resolvers, gql } from "@apollo/client";
import { buildTypeDefsAndResolvers } from "../../../../src";

import CounterResolver from "../Counter/counter.resolver";
import CounterType from "../Counter/counter.type";

export default async function createApolloClient() {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [CounterResolver],
    skipCheck: true, // allow for schema without queries
  });

  const cache = new InMemoryCache();

  cache.writeQuery({
    query: gql`
      query {
        counter @client {
          __typename
          value
        }
      }
    `,
    data: {
      counter: {
        __typename: CounterType.name,
        value: 0,
      },
    },
  });

  const client = new ApolloClient({
    typeDefs,
    resolvers: resolvers as Resolvers,
    cache,
  });

  return client;
}
