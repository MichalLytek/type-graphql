import "reflect-metadata";
import "dotenv/config";
import http from "node:http";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { WebSocketServer } from "ws";
import { RecipeResolver } from "./recipe.resolver";

async function bootstrap() {
  // Create Redis-based pub-sub
  const pubSub = new RedisPubSub({
    publisher: new Redis(process.env.REDIS_URL!, {
      retryStrategy: times => Math.max(times * 100, 3000),
    }),
    subscriber: new Redis(process.env.REDIS_URL!, {
      retryStrategy: times => Math.max(times * 100, 3000),
    }),
  });

  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    // Provide Redis-based instance of pub-sub
    pubSub,
    validate: false,
  });

  // Create an Express app and HTTP server
  // The WebSocket server and the ApolloServer will be attached to this HTTP server
  const app = express();
  const httpServer = http.createServer(app);

  // Create WebSocket server using the HTTP server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  // Save the returned server's info so it can be shutdown later
  const serverCleanup = useServer({ schema }, wsServer);

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server
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

  // Start server
  await server.start();
  app.use("/graphql", cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));

  // Now that the HTTP server is fully set up, we can listen to it
  httpServer.listen(4000, () => {
    console.log(`GraphQL server ready at http://localhost:4000/graphql`);
  });
}

bootstrap().catch(console.error);
