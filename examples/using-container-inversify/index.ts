import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "inversify";
import { buildSchema } from "../../src";

import { TYPES } from "./types";
import { Recipe } from "./recipe-type";
import { sampleRecipes } from "./sample-recipes";
import { RecipeServiceImpl } from "./recipe-service-impl";
import { RecipeService } from "./recipe-service";
import { RecipeResolver } from "./recipe-resolver";

// create Inversify container
const container = new Container({ defaultScope: "Singleton" });
// put sample recipes in container
container.bind<Recipe[]>(TYPES.SampleRecipes).toConstantValue(sampleRecipes.slice());
// put RecipeService in container, binding the interface to its implementation
container.bind<RecipeService>(TYPES.RecipeService).to(RecipeServiceImpl);
// put RecipeResolver in container, and, yes, it must be like that to work
container
  .bind<RecipeResolver>(RecipeResolver)
  .to(RecipeResolver)
  .inSingletonScope();

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    // register 3rd party IOC container
    container,
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
