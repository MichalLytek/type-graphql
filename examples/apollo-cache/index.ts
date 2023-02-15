import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginCacheControl } from "@apollo/server/plugin/cacheControl";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./recipe.resolver";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
  });

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    plugins: [
      // Cache headers
      ApolloServerPluginCacheControl(),
      // In-memory cache
      responseCachePlugin(),
    ],
  });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap();
