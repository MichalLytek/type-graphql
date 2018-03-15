import "reflect-metadata";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "../../src";

import { ExampleResolver } from "./resolver";
import { Context } from "./context.interface";
import { authChecker } from "./auth-checker";

void async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [ExampleResolver],
    authChecker, // register auth checking function
  });

  // create express-based gql endpoint
  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP(req => {
      const context: Context = {
        // create mocked user in context
        // in real app you would be mapping user from `req.user` or sth
        user: {
          id: 1,
          name: "Sample user",
          roles: ["REGULAR"],
        },
      };
      return {
        schema,
        graphiql: true,
        context,
      };
    }),
  );
  app.listen(4000, () => {
    console.log("Running a GraphQL API server at localhost:4000/graphql");
  });
}();
