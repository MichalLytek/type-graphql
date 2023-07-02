import { users } from "./data";
import type { User } from "./user";

export async function resolveUserReference(reference: Pick<User, "id">): Promise<User> {
  return users.find(u => u.id === reference.id)!;
}
