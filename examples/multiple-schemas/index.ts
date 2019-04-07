import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe/recipe.resolver";
import { Recipe } from "./recipe/recipe.type";
import { PersonResolver } from "./person/person.resolver";
import { Person } from "./person/person.type";
import { GetAllArgs } from "./resource/resource.resolver";
import * as path from "path";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schemaRecipe = await buildSchema({
    resolvers: [RecipeResolver],
    types: [Recipe, GetAllArgs],
    container: Container,
    emitSchemaFile: path.resolve(__dirname, "schemaRecipe.gql"),
  });

  const schemaPerson = await buildSchema({
    resolvers: [PersonResolver],
    types: [Person, GetAllArgs],
    container: Container,
    emitSchemaFile: path.resolve(__dirname, "schemaPerson.gql"),
  });

  // Create GraphQL server
  const serverRecipe = new ApolloServer({ schema: schemaRecipe });
  const serverPerson = new ApolloServer({ schema: schemaPerson });

  // Start the server
  const { url: recipeUrl } = await serverRecipe.listen(4000);
  console.log(`Server recipe is running, GraphQL Playground available at ${recipeUrl}`);

  const { url: personUrl } = await serverPerson.listen(4001);
  console.log(`Server recipe is running, GraphQL Playground available at ${personUrl}`);
}

bootstrap();
