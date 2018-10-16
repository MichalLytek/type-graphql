import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import { buildSchema, useContainer } from "../../src";

import { RecipeResolver } from "./recipe/recipe.resolver";
import { PersonResolver } from "./person/person.resolver";

useContainer(Container);

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver, PersonResolver],
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
