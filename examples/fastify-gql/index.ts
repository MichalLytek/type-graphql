import "reflect-metadata";
import fastify from "fastify";
import fastifyGQL from "fastify-gql";
import { buildSchema } from "../../src";
import { RecipeResolver } from "./recipe-resolver";

const app = fastify();

async function bootStrap() {
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    dateScalarMode: "isoDate",
    validate: false,
    emitSchemaFile: true,
  });

  await app.register(fastifyGQL, {
    schema,
    routes: true,
    graphiql: "playground",
    path: "/graphql",
    // Disabling jit as it conflicting with type-graphql especially with Enums
    jit: 0,
  });

  const url = await app.listen(3000);

  console.log(`Server is running, GraphQL Playground available at ${url}/playground`);
}

bootStrap().catch(err => {
  throw err;
});
