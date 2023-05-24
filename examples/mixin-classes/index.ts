import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as path from "path";
import { buildSchema } from "type-graphql";

import UserResolver from "./resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    skipCheck: true,
    validate: true,
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap().catch(console.error);
