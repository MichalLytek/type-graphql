import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "apollo-server";
import * as path from "path";
import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core";
import { buildSchema } from "type-graphql";
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
    clientUrl: process.env.DATABASE_URL,
    type: "postgresql",
  });

  console.log(`Setting up the database...`);
  const generator = orm.getSchemaGenerator();
  // remember to create database manually before launching the code
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();
  // seed database with some data
  const { defaultUser } = await seedDatabase(orm.em.fork());

  console.log(`Bootstrapping schema and server...`);
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver, RateResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
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
