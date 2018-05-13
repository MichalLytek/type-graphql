import * as NodeWebSocket from "ws";
import { AddressInfo } from "net";
import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import { GraphQLSchema } from "graphql";
import { GraphQLServer } from "graphql-yoga";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

export interface WebSocketUtils {
  apollo: ApolloClient<any>;
  server: HTTPServer | HTTPSServer;
}

export async function createWebSocketUtils(schema: GraphQLSchema): Promise<WebSocketUtils> {
  const graphQLServer = new GraphQLServer({ schema });
  const server = await graphQLServer.start({
    port: 0,
    playground: false,
    endpoint: "/graphql",
    subscriptions: "/graphql",
  });

  const subscriptionClient = new SubscriptionClient(
    `ws://localhost:${(server.address() as AddressInfo).port}/graphql`,
    { reconnect: true },
    NodeWebSocket,
  );
  const apollo = new ApolloClient({
    link: new WebSocketLink(subscriptionClient),
    cache: new InMemoryCache(),
  });
  return {
    apollo,
    server,
  };
}
