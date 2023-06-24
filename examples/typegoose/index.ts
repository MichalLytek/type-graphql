import "reflect-metadata";
import "dotenv/config";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Types, connect } from "mongoose";
import { buildSchema } from "type-graphql";
import type { Context } from "./context.type";
import { seedDatabase } from "./helpers";
import { ObjectIdScalar } from "./object-id.scalar";
import { RatingResolver, RecipeResolver } from "./resolvers";
import { TypegooseMiddleware } from "./typegoose.middleware";

async function bootstrap() {
  // Create mongoose connection
  const mongoose = await connect(process.env.DATABASE_URL!);

  // Clean database
  await mongoose.connection.db.dropDatabase();
  // Seed database with some data
  const { defaultUser } = await seedDatabase();

  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver, RatingResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    // Use document converting middleware
    globalMiddlewares: [TypegooseMiddleware],
    // Use ObjectId scalar mapping
    scalarsMap: [{ type: Types.ObjectId, scalar: ObjectIdScalar }],
    validate: false,
  });

  // Create mocked context
  const context: Context = { user: defaultUser };

  // Create GraphQL server
  const server = new ApolloServer<Context>({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => context,
  });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap();
