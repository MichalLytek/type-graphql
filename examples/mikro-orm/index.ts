import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as path from "path";
import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./resolvers/recipe-resolver";
import { RateResolver } from "./resolvers/rate-resolver";
import { Rate } from "./entities/rate";
import { Recipe } from "./entities/recipe";
import { User } from "./entities/user";
import { ContextType } from "./types";
import { seedDatabase } from "./helpers";

async function bootstrap() {
  console.log(`Initializing database connection...`);
  const orm = await MikroORM.init({
    metadataProvider: ReflectMetadataProvider,
    cache: { enabled: false },
    entities: [Rate, Recipe, User],
    dbName: "mikro-orm",
    type: "postgresql",
    user: "postgres", // fill this with your username
    password: "qwerty", // and password
    host: "localhost", // and host
    port: 5434, // and port
    // baseDir: __dirname, // defaults to `process.cwd()`
  });

  console.log(`Setting up the database...`);
  const generator = orm.getSchemaGenerator();
  // remember to create database manually before launching the code
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();
  // seed database with some data
  const { defaultUser } = await seedDatabase(orm.em);

  console.log(`Bootstraping schema and server...`);
  const schema = await buildSchema({
    resolvers: [RecipeResolver, RateResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    validate: false,
  });
  const server = new ApolloServer({
    schema,
    context: (): ContextType => ({
      user: defaultUser,
      // create fresh instance of entity manager per request
      // https://mikro-orm.io/docs/identity-map
      entityManager: orm.em.fork(),
    }),
  });

  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap().catch(console.error);
