import "reflect-metadata";
import "dotenv/config";
import http from "node:http";
import path from "node:path";
import { createYoga } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { pubSub } from "./pubsub";
import { RecipeResolver } from "./recipe.resolver";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    // Publish/Subscribe
    pubSub,
    validate: false,
  });

  // Create GraphQL server
  const yoga = createYoga({
    schema,
    graphqlEndpoint: "/graphql",
  });

  // Create server
  const httpServer = http.createServer(yoga);

  // Start server
  httpServer.listen(4000, () => {
    console.log(`GraphQL server ready at http://localhost:4000/graphql`);
  });
}

bootstrap().catch(console.error);
