import { users } from "./data";
import User from "./user";

export const UserReferenceResolver = async (reference: Pick<User, "id">, ctx: any, info: any): Promise<User> => {
  return users.find(u => u.id === reference.id)!;
}
