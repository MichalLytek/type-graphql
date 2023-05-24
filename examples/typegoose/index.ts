import "reflect-metadata";
import { ApolloServer } from "apollo-server";
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
    console.log("DB_CONNECTION_URL", process.env.DB_CONNECTION_URL);
    // create mongoose connection
    const mongoose = await connect(process.env.DB_CONNECTION_URL!);

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
    const server = new ApolloServer({ schema, context });

    // Start the server
    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
