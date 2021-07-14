import { users } from "./data";
import User from "./user";

export const UserReferenceResolver = async (ref: Pick<User, 'Id'>, ctx: any, info: any): Promise<User> => {
  return users.find(u => u.id === reference.id)!;
}
