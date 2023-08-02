import { type EntityManager } from "@mikro-orm/core";
import { type User } from "./entities";

export interface Context {
  entityManager: EntityManager;
  user: User;
}
