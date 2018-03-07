import "reflect-metadata";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { Container } from "typedi";
import * as TypeGraphQL from "../../src";
import * as TypeORM from "typeorm";

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
      username: "root",
      password: "qwerty123",
      port: 3306,
      host: "localhost",
      entities: [Recipe, Rate, User],
      synchronize: true,
      logger: "advanced-console",
      logging: "all",
      // logging: ["error"],
      dropSchema: true,
      cache: true,
    });

    // seed database with some data
    const { defaultUser } = await seedDatabase();

    // build TypeGraphQL executable schema
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [RecipeResolver, RateResolver],
    });

    // create express-based gql endpoint
    const app = express();
    app.use(
      "/graphql",
      graphqlHTTP({
        schema,
        graphiql: true,
        context: { user: defaultUser },
      }),
    );
    app.listen(4000, () => {
      console.log("Running a GraphQL API server at localhost:4000/graphql");
    });
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
