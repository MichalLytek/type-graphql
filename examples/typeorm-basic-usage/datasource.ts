import * as TypeORM from "typeorm";
import { Rating, Recipe, User } from "./entities";

// Create TypeORM dataSource
export const dataSource = new TypeORM.DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  dropSchema: true,
  cache: true,
  logging: "all",
  entities: [Rating, Recipe, User],
  logger: "advanced-console",
});
