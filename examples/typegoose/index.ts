import "reflect-metadata";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import { connect, Types } from "mongoose";
import * as path from "path";
import dotenv from "dotenv";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./resolvers/recipe-resolver";
import { RateResolver } from "./resolvers/rate-resolver";
import { User } from "./entities/user";
import { seedDatabase } from "./helpers";
import { TypegooseMiddleware } from "./typegoose-middleware";
import { ObjectIdScalar } from "./object-id.scalar";

dotenv.config();

export interface Context {
  user: User;
}

async function bootstrap() {
  try {
    // create mongoose connection
    const mongoose = await connect(process.env.DATABASE_URL!);

    // clean and seed database with some data
    await mongoose.connection.db.dropDatabase();
    const { defaultUser } = await seedDatabase();

    // build TypeGraphQL executable schema
    const schema = await buildSchema({
      resolvers: [RecipeResolver, RateResolver],
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
      // use document converting middleware
      globalMiddlewares: [TypegooseMiddleware],
      // use ObjectId scalar mapping
      scalarsMap: [{ type: Types.ObjectId, scalar: ObjectIdScalar }],
      validate: false,
    });

    // create mocked context
    const context: Context = { user: defaultUser };

    // Create GraphQL server
    const server = new ApolloServer<Context>({ schema });

    // Start server
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async () => context,
    });
    console.log(`GraphQL server ready at ${url}`);
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
