import "reflect-metadata";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { Container } from "typedi";
import { useContainer, buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";
import { sampleRecipes } from "./sample-recipes";

// register 3rd party IOC container
useContainer(Container);

// put sample recipes in container
Container.set("SAMPLE_RECIPES", sampleRecipes);

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  // create express-based gql endpoint
  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  );
  app.listen(4000, () => {
    console.log("Running a GraphQL API server at localhost:4000/graphql");
  });
}

bootstrap();
