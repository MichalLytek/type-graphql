import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import path from "path";
import dotenv from "dotenv";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./resolvers/recipe-resolver";
import { Recipe } from "./entities/recipe";
import { Rate } from "./entities/rate";
import { User } from "./entities/user";
import { seedDatabase } from "./helpers";
import { Context } from "./resolvers/types/context";

// read .env file
dotenv.config();

// register 3rd party IOC container
TypeORM.useContainer(Container);

async function bootstrap() {
  try {
    // create TypeORM connection
    await TypeORM.createConnection({
      type: "postgres",
      url: process.env.DB_CONNECTION_URL,
      entities: [Recipe, Rate, User],
      synchronize: true,
      logger: "advanced-console",
      logging: "all",
      dropSchema: true,
      cache: true,
    });

    // seed database with some data
    const { defaultUser } = await seedDatabase();

    // build TypeGraphQL executable schema
    const schema = await buildSchema({
      resolvers: [RecipeResolver],
      container: Container,
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
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
