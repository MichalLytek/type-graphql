import { EntityManager } from "@mikro-orm/core";

import { User } from "./entities/user";

export interface ContextType {
  entityManager: EntityManager;
  user: User;
}
