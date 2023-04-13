import * as TypeORM from "typeorm";
import { Rating, Recipe, User } from "./entities";

// Create TypeORM dataSource
export const dataSource = new TypeORM.DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "type-graphql-basic",
  synchronize: true,
  dropSchema: true,
  cache: true,
  logging: "all",
  entities: [Rating, Recipe, User],
  logger: "advanced-console",
});
