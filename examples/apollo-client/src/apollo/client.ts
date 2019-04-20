import ApolloClient, { Resolvers } from "apollo-boost";
import { buildTypeDefsAndResolvers } from "../../../../src";

import CounterResolver from "../Counter/counter.resolver";
import CounterType from "../Counter/counter.type";

export default async function createApolloClient() {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [CounterResolver],
    skipCheck: true, // allow for schema without queries
  });

  const client = new ApolloClient({
    clientState: {
      typeDefs,
      resolvers: resolvers as Resolvers,
      defaults: {
        counter: {
          __typename: CounterType.name,
          value: 0,
        },
      },
    },
  });

  return client;
}
