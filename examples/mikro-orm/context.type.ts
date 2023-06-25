import type { EntityManager } from "@mikro-orm/core";
import type { User } from "./entities";

export type Context = {
  entityManager: EntityManager;
  user: User;
};
