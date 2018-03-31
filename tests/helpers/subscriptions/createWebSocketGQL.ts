import { GraphQLSchema, execute, subscribe } from "graphql";
import * as NodeWebSocket from "ws";
import * as http from "http";
import { SubscriptionClient, SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

export interface WebSocketGQL {
  apollo: ApolloClient<any>;
  close: () => void;
}

export function createWebSocketGQL(schema: GraphQLSchema) {
  return new Promise<WebSocketGQL>(resolve => {
    const websocketServer = http.createServer((request, response) => {
      response.writeHead(404);
      response.end();
    });
    websocketServer.listen(0, () => {
      const WS_PORT = websocketServer.address().port;
      const WS_GRAPHQL_ENDPOINT = `ws://localhost:${WS_PORT}/graphql`;

      const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: websocketServer, path: "/graphql" },
      );
      const subscriptionClient = new SubscriptionClient(
        WS_GRAPHQL_ENDPOINT,
        { reconnect: true },
        NodeWebSocket,
      );
      const apollo = new ApolloClient({
        link: new WebSocketLink(subscriptionClient),
        cache: new InMemoryCache(),
      });
      resolve({
        apollo,
        close: () => {
          subscriptionServer.close();
          subscriptionClient.close();
          websocketServer.close();
        },
      });
    });
  });
}
