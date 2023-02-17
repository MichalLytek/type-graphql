import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import path from "node:path";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe/recipe.resolver";
import { PersonResolver } from "./person/person.resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver, PersonResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    container: Container,
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
