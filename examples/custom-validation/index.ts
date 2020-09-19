import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as joiful from "joiful";
import * as path from "path";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    // custom validate function
    validate: (argValue, argType) => {
      // call joiful validate
      const { error } = joiful.validate(argValue);
      if (error) {
        // throw error on failed validation
        throw error;
      }
    },
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
