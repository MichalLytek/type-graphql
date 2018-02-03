import "reflect-metadata";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { Container } from "typedi";
import { useContainer, buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

// register 3rd party IOC container
useContainer(Container);

// build TypeGraphQL executable schema
const schema = buildSchema({
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
