import "reflect-metadata";
import { GraphQLServer, Options } from "graphql-yoga";
import * as Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe.resolver";

const REDIS_HOST = "192.168.99.100"; // replace with own IP
const REDIS_PORT = 6379;

async function bootstrap() {
  // configure Redis connection options
  const options: Redis.RedisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: times => Math.max(times * 100, 3000),
  };

  // create Redis-based pub-sub
  const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });

  // Build the TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    pubSub, // provide redis-based instance of PubSub
  });

  // Create GraphQL server
  const server = new GraphQLServer({ schema });

  // Configure server options
  const serverOptions: Options = {
    port: 4000,
    endpoint: "/graphql",
    subscriptions: "/graphql",
    playground: "/playground",
  };

  // Start the server
  server.start(serverOptions, ({ port, playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
    );
  });
}

bootstrap();
