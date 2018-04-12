import "reflect-metadata";
import { GraphQLServer, Options } from "graphql-yoga";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import * as TypeGraphQL from "../../src";

import { RecipeResolver } from "./resolvers/recipe-resolver";
import { RateResolver } from "./resolvers/rate-resolver";
import { Recipe } from "./entities/recipe";
import { Rate } from "./entities/rate";
import { User } from "./entities/user";
import { seedDatabase } from "./helpers";

export interface Context {
  user: User;
}

// register 3rd party IOC container
TypeGraphQL.useContainer(Container);
TypeORM.useContainer(Container);

async function bootstrap() {
  try {
    // create TypeORM connection
    await TypeORM.createConnection({
      type: "mysql",
      database: "type-graphql",
      username: "root", // fill this with your username
      password: "qwerty123", // and password
      port: 3306,
      host: "localhost",
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
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [RecipeResolver, RateResolver],
    });

    // create mocked context
    const context: Context = { user: defaultUser };

    // Create GraphQL server
    const server = new GraphQLServer({ schema, context });

    // Configure server options
    const serverOptions: Options = {
      port: 4000,
      endpoint: "/graphql",
      playground: "/playground",
    };

    // Start the server
    server.start(serverOptions, ({ port, playground }) => {
      console.log(
        `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
      );
    });
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
