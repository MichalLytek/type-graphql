import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import Redis, { RedisOptions } from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe.resolver";

const REDIS_HOST = "192.168.99.100"; // replace with own IP
const REDIS_PORT = 6379;

async function bootstrap() {
  // configure Redis connection options
  const options: RedisOptions = {
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
    validate: false,
    pubSub, // provide redis-based instance of PubSub
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
