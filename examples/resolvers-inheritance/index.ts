import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Container } from "typedi";
import { PersonResolver } from "./person/person.resolver";
import { RecipeResolver } from "./recipe/recipe.resolver";
import { buildSchema } from "../../src";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver, PersonResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    container: Container,
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap();
