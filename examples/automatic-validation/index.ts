import "reflect-metadata";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { useContainer, buildSchema, formatArgumentValidationError } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

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
      formatError: formatArgumentValidationError,
    }),
  );
  app.listen(4000, () => {
    console.log("Running a GraphQL API server at localhost:4000/graphql");
  });
}

bootstrap();
