import "reflect-metadata";
import "dotenv/config";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { buildSchema } from "type-graphql";
import type { Context } from "./context.type";
import { Rating, Recipe, User } from "./entities";
import { seedDatabase } from "./helpers";
import { RatingResolver, RecipeResolver } from "./resolvers";

async function bootstrap() {
  // Initialize MikroORM
  const orm = await MikroORM.init<PostgreSqlDriver>({
    type: "postgresql",
    clientUrl: process.env.DATABASE_URL,
    entities: [Rating, Recipe, User],
    metadataProvider: ReflectMetadataProvider,
    cache: { enabled: false },
  });
  const generator = orm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();

  // Seed database with some data
  const { defaultUser } = await seedDatabase(orm.em.fork());

  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver, RatingResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    validate: false,
  });

  // Create GraphQL server
  const server = new ApolloServer<Context>({
    schema,
  });

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () =>
      ({
        user: defaultUser,
        // Create fresh instance of entity manager per request
        entityManager: orm.em.fork(),
      } satisfies Context),
  });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
