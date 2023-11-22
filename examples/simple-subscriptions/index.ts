import "reflect-metadata";
import http from "node:http";
import path from "node:path";
import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { pubSub } from "./pubsub";
import { SampleResolver } from "./resolver";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [SampleResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    pubSub,
  });

  const yoga = createYoga({
    schema,
    graphqlEndpoint: "/graphql",
  });

  const httpServer = http.createServer(yoga);

  // Now that the HTTP server is fully set up, we can listen to it
  httpServer.listen(4000, () => {
    console.log(`GraphQL server ready at http://localhost:4000/graphql`);
  });
}

bootstrap().catch(console.error);
