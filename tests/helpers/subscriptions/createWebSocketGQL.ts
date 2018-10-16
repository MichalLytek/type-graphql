import * as NodeWebSocket from "ws";
import { GraphQLSchema } from "graphql";
import { ApolloServer } from "apollo-server";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

export interface WebSocketUtils {
  apolloClient: ApolloClient<unknown>;
  apolloServer: ApolloServer;
}

export default async function createWebSocketUtils(schema: GraphQLSchema): Promise<WebSocketUtils> {
  const apolloServer = new ApolloServer({
    schema,
    playground: false,
  });
  const { subscriptionsUrl } = await apolloServer.listen({
    port: 0,
  });

  const subscriptionClient = new SubscriptionClient(
    subscriptionsUrl,
    { reconnect: true },
    NodeWebSocket,
  );
  const apolloClient = new ApolloClient({
    link: new WebSocketLink(subscriptionClient),
    cache: new InMemoryCache(),
  });
  return {
    apolloClient,
    apolloServer,
  };
}
