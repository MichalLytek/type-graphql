import "reflect-metadata";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import express from "express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { buildSchema } from "type-graphql";
import { SampleResolver } from "./resolver";

async function bootstrap() {
  // Build the TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [SampleResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer({ schema }, wsServer);

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(
      `Server is running, GraphQL Playground available atn http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
}

bootstrap();
