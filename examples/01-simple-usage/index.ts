import "reflect-metadata";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { useContainer, buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

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
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
