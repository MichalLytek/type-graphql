import { EntityManager } from "mikro-orm";

import { User } from "./entities/user";

export interface ContextType {
  entityManager: EntityManager;
  user: User;
}
