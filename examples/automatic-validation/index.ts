import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema, formatArgumentValidationError } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    // remember to pass `formatArgumentValidationError`
    // otherwise validation errors won't be returned to a client
    formatError: formatArgumentValidationError,
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
